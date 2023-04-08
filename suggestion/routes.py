from sklearn.preprocessing import normalize
from flask import request, render_template, Response

# from dotenv import load_dotenv
# import os
import requests
import numpy as np
import json
import hdbscan

from load_model import sbert_model
from functions import get_user_list, get_cluster_dict, data_processing_for_get_content, get_classifies, cosine, get_all_friends
from db_config import db, neo4j_auth


def testmodel():
    if request.method == "POST":
        sentence_embeddings1 = sbert_model.encode(request.form['sentence'])
        sentence_embeddings2 = sbert_model.encode(request.form['sentence2'])
        return render_template('modelResult.html', result=str(cosine(sentence_embeddings1, sentence_embeddings2)))
    else:
        return render_template('testmodel.html')


def test():
    data = {"0": {"name": "/Finance/Investing/Currencies & Foreign Exchange", "userList": ["313837383832373239686868", "343734313433373734686868", "353034313235323634686868", "333630393037353230686868", "343735333633393032686868", "343039373337393334686868", "343532323431353238686868", "353133343633343439686868", "343333303932343335686868", "343730303835383835686868", "343431373134393430686868", "313734363534393437686868", "353030383033373736686868", "343537383832303431686868", "343233313637353738686868", "333432313932383539686868", "343337363136353232686868", "343031303331303434686868", "333930323239313738686868", "343434373136363233686868", "343330363631323339686868", "343533393236393336686868", "343939303839383631686868", "343637383933373832686868", "333935303431303939686868", "343635353939353339686868"]},
            "1": {"name": "/Finance/Investing/Currencies & Foreign Exchange", "userList": ["343031303331303434686868", "343434373136363233686868", "343730303835383835686868", "343537383832303431686868"]}}
    requests.post(f'http://localhost:4000/api/notification/new', json={
        'conversationId': '6344e91b89558fb2b5ec0001',
        'data': json.dumps(data)
    })
    return Response(json.dumps({
        'successful': True,
    }), status=200, mimetype='application/json')


def checkgrouping():
    conversation_id = request.form['conversation_id']
    datareal = {}
    data = db.chats.find({'conversationId': conversation_id}).sort(
        "createdAt", -1).limit(1000)

    GROUP_MEMBER_LIMIT = [0, 100]
    GROUP_MESSAGE_LIMIT = 0
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
                                min_cluster_size=8, gen_min_span_tree=True, prediction_data=True)
    clusterer.fit(norm_data)
    print(get_cluster_dict(clusterer.labels_))

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
    print(reject_list)

    result = data_processing_for_get_content(
        np.flip(clusterer.labels_), np.flip(sentences), reject_list)

    final = {}

    for k, v in result.items():
        final[k] = {
            "name": get_classifies(v)
        }

    user_list = get_user_list(clusterer.labels_, userList, reject_list)
    for k, v in user_list.items():
        final[k]["userList"] = list(v)

    my_dict_converted2 = {
        str(k): v for k, v in final.items()}
    print(my_dict_converted2)
    # requests.post('http://localhost:4000/api/notification/new', json={
    #     'conversationId': conversation_id,
    #     'data': json.dumps(my_dict_converted2)
    # })
    return Response(json.dumps({'successful': True}), status=200, mimetype='application/json')

# 1 week


def get_recommend_group():
    neo4j = neo4j_auth()
    data = neo4j.run(
        "match (u:User)-[r:CONTACTED]->(u1:User) match (u)-[:LIKE]->(t:Topic)<-[:LIKE]-(u1) return distinct u,u1 order by u.username").data()

    groups = []
    refactor_data = {}
    # for i in data:
    #     print(dict(i))

    for record in data:
        u = dict(record["u"])
        u1 = dict(record["u1"])
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
    for i in range(len(groups)):
        groups[i] = list(set(groups[i]))

    return groups


def detectUserTopic():
    user_Id = request.form['user_Id']

    userData = db.chats.find({'userId': user_Id}, {'content': 1}).sort(
        "createdAt", -1).limit(100)

    contentArray = []
    for message in list(userData):
        contentArray.append(message['content'])

    topic = get_classifies("".join(contentArray))
    # print(topic)
    # topic = "World"
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
