from sklearn.preprocessing import normalize
from flask import request, render_template, Response
from app import app
from dotenv import load_dotenv
import os
import requests
import numpy as np
import json
import hdbscan

from load_model import sbert_model
from functions import get_user_list, get_cluster_dict, data_processing_for_get_content, get_classifies, cosine, get_all_friends
from db_config import db, neo4j_auth

load_dotenv()

def testmodel():
    if request.method == "POST":
        sentence_embeddings1 = sbert_model.encode(request.form['sentence'])
        sentence_embeddings2 = sbert_model.encode(request.form['sentence2'])
        return render_template('modelResult.html', result=str(cosine(sentence_embeddings1, sentence_embeddings2)))
    else:
        return render_template('testmodel.html')


def test():
    app.logger.info("Testing model")
    return Response(json.dumps({
        'successful': True,
    }), status=200, mimetype='application/json')


def checkgrouping():
    conversation_id = request.form['conversation_id']
    datareal = {}
    data = db.chats.find({'conversationId': conversation_id}).sort(
        "createdAt", -1).limit(200)

    GROUP_MEMBER_LIMIT = [2, 100]
    GROUP_MESSAGE_LIMIT = 5
    for e in data:
        datareal[str(e['_id'])] = e

    data = datareal
    sentences = []
    userList = []

    for k, v in data.items():
        if v['replyFrom'] is not None:
            if v["replyFrom"] in data:
                sentences.append(data[v["replyFrom"]]
                                ["content"] + ". " + v["content"])
            else:
                sentences.append(v["content"])
        else:
            sentences.append(v["content"])
        userList.append(v["userId"])

    sentence_embeddings = sbert_model.encode(sentences)
    data_processing = np.array(sentence_embeddings)
    norm_data = normalize(data_processing, norm='l2')
    clusterer = hdbscan.HDBSCAN(algorithm='best', alpha=1.0, approx_min_span_tree=True,
                                min_cluster_size=5, gen_min_span_tree=True, prediction_data=True)
    clusterer.fit(norm_data)
    app.logger.info(get_cluster_dict(clusterer.labels_))

    reject_list = set()
    for k, v in get_cluster_dict(clusterer.labels_).items():
        if v < GROUP_MESSAGE_LIMIT:
            print("reject by message limit")
            reject_list.add(k)

    for k, v in get_user_list(clusterer.labels_, userList, reject_list).items():
        # print(len(v))
        if len(v) <= GROUP_MEMBER_LIMIT[0] or len(v) >= GROUP_MEMBER_LIMIT[1]:
            print("reject by member limit")
            reject_list.add(k)

    reject_list = list(reject_list)
    app.logger.info(reject_list)

    result = data_processing_for_get_content(
        np.flip(clusterer.labels_), np.flip(sentences), reject_list)

    final = {}

    for k, v in result.items():
        predict = get_classifies(v)
        final[k] = {
            "name": predict.name,
            "confidence": predict.confidence
        }

    user_list = get_user_list(clusterer.labels_, userList, reject_list)
    for k, v in user_list.items():
        final[k]["userList"] = list(v)

    my_dict_converted2 = {
        str(k): v for k, v in final.items()}
    app.logger.info(my_dict_converted2)
    requests.post(f'{os.getenv("NODE_SERVER_URL")}/api/notification/new', json={
        'conversationId': conversation_id,
        'data': json.dumps(my_dict_converted2)
    })
    return Response(json.dumps({'successful': True}), status=200, mimetype='application/json')

# 1 week


def get_recommend_group():
    neo4j = neo4j_auth()
    data = neo4j.run(
        "match (u:User)-[r:CONTACTED]->(u1:User) match (u)-[:LIKE]->(t:Topic)<-[:LIKE]-(u1) return distinct u,u1,t order by u.username").data()

    groups = []
    refactor_data = {}
    topicObj = {}
    # for i in data:
    #     print(dict(i))

    for record in data:
        u = dict(record["u"])
        u1 = dict(record["u1"])
        t = dict(record["t"])
        topicObj[u["_id"]] = t["name"]
        if u["_id"] not in refactor_data:
            refactor_data[u["_id"]] = [u1["_id"]]
        else:
            refactor_data[u["_id"]].append(u1["_id"])

    print(refactor_data)
    
    access_list = []
    for k, v in refactor_data.items():
        if groups:
            if k in access_list:
                continue
            else:
                groups.append(get_all_friends(refactor_data, access_list, k))
        else:
            groups.append(get_all_friends(refactor_data, access_list, k))
            print(groups)

    # unique list
    topicList = []
    for i in range(len(groups)):
        groups[i] = list(set(groups[i]))

    for i in range(len(groups)):
        # print(topicObj[groups[i][0]])
        topicList.append(topicObj[groups[i][0]])
    
    return {"group": groups, "topics" : topicList}


def detectUserTopic():
    user_Id = request.form['user_Id']
    data = db.chats.find({'userId': user_Id}, {'content': 1}).sort(
        "createdAt", -1).limit(100)
    sentences = []
    for e in data:
        if len(e['content']) > 5:
            sentences.append(e['content'])

    sentence_embeddings = sbert_model.encode(sentences)
    data_processing = np.array(sentence_embeddings)
    norm_data = normalize(data_processing, norm='l2')
    clusterer = hdbscan.HDBSCAN(algorithm='best', alpha=1.0, approx_min_span_tree=True,
                                min_cluster_size=3, gen_min_span_tree=True, prediction_data=True)
    clusterer.fit(norm_data)
    app.logger.info(get_cluster_dict(clusterer.labels_))

    reject_list = []
    result = data_processing_for_get_content(
        np.flip(clusterer.labels_), np.flip(sentences), reject_list)

    topic = ""
    maxConfidence = 0
    for k, v in result.items():
        # print(v)
        # print('\n')
        predict = get_classifies(v)
        app.logger.info(predict)
        if predict and predict.confidence > maxConfidence:
            maxConfidence = predict.confidence
            topic = predict.name
        
    app.logger.info(topic)

    if len(topic) == 0:
        return "No topic found"

    neo4j = neo4j_auth()

    cypher = 'merge (t:Topic {name :"' + topic + '"}) return t '
    neo4j.run(cypher)

    data = neo4j.run(
        'match (u:User {`_id`: "' + str(user_Id) + '"}) match (u)-[:LIKE]->(t:Topic) return t')
    if (len(list(data)) != 0):

        cypher = 'match (u:User {`_id`: "' + str(user_Id) + \
            '"})-[r:LIKE]->(t:Topic) delete r'
        neo4j.run(cypher)

    cypher = 'match (u:User {`_id`: "'+str(user_Id)+'"}) match (t:Topic {`name` : "' + str(
        topic)+'"}) create (u)-[r:LIKE]->(t) return r'
    neo4j.run(cypher)

    # for record in data:
    #     u = dict(record['u'])
    #     print(u)
    return "success"
