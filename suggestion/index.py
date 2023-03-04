# import configparser
# import os
from sklearn.preprocessing import normalize
from flask_pymongo import PyMongo
from flask import Flask, redirect, url_for, request, render_template, Response
from google.cloud import language_v1
from dotenv import load_dotenv
import os
import requests
from sentence_transformers import SentenceTransformer
import numpy as np
# import sklearn.datasets as data
import json
import hdbscan
# from bson import json_util, ObjectId
app = Flask(__name__)

load_dotenv()
sbert_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')


def cosine(u, v):
    return np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))


# from pymongo import MongoClient

app.config['MONGO_URI'] = os.getenv("DB_CONNECT_PATH")
mongodb_client = PyMongo(app)
db = mongodb_client.db
# client = MongoClient("mongodb+srv://baonguyen:bao7122001@cluster0.k6yhm.mongodb.net/bk-chat?retryWrites=true&w=majority")
# db = client["bkchat"]
# collection = db["conversations"]


# @app.route('/hello', methods=['GET'])
# def index():
#     return "Hello, world!"


# @app.route('/student/<int:studentID>', methods=['GET'])
# def studentAPI(studentID):
#     if studentID == 1:
#         return redirect(url_for('adminAPI'))
#     else:
#         return "Student API " + str(studentID)


# @app.route('/admin', methods=['GET'])
# def adminAPI():
#     return "admin API"


# @app.route('/student/<int:studentID>/<float:student_subid>', methods=['GET'])
# def substudentAPI(studentID,student_subid):
#     return str(student_subid)


# @app.route('/home/<name>')
# def loginSuccess(name):
#     return render_template('home.html', name=name)

# @app.route('/grade', methods=['POST'])
# def checkGrade():
#     grade = request.form['grade']
#     return render_template('showResult.html', grade=int(grade))

# @app.route('/login', methods=['POST', "GET"])
# def login():
#     if request.method == "POST":
#         user = request.form['name']
#         return redirect(url_for('loginSuccess', name = user))
#     else:
#         return render_template('login.html')


# @app.route('/flag', methods=['POST'])
# def flag():


# def getData()
# def runModal()

@app.route('/testmodel', methods=['POST', 'GET'])
def testmodel():
    if request.method == "POST":
        sentence_embeddings1 = sbert_model.encode(request.form['sentence'])
        sentence_embeddings2 = sbert_model.encode(request.form['sentence2'])
        return render_template('modelResult.html', result=str(cosine(sentence_embeddings1, sentence_embeddings2)))
    else:
        return render_template('testmodel.html')


def get_user_list(labels, userList):
    group_dict = {}
    for i in range(len(labels)):
        if (labels[i] == -1):
            continue
        else:
            if (labels[i] not in group_dict):
                group_dict[labels[i]] = {userList[i]}
            else:
                group_dict[labels[i]].add(userList[i])
    return group_dict


def get_cluster_dict(labels):
    final_dict = {}
    count = 0
    for i in labels:
        count += 1
        if (i == -1):
            continue
        else:
            # if i == 1: print(count)
            if (i not in final_dict):
                final_dict[i] = 1
            else:
                final_dict[i] += 1
    return final_dict


def data_processing_for_get_content(cluster, chat_data):
    result = {}
    count_prev1 = 0
    for i in range(len(cluster)):
        if (cluster[i] == -1):
            count_prev1 += 1
            continue
        else:
            if cluster[i] not in result.keys():
                result[cluster[i]] = chat_data[i]
            else:
                # print("noi")
                result[cluster[i]] = result[cluster[i]] + ". " + chat_data[i]
            
    return result
    # for k,v in 
    
def get_classifies(text_content):
    client = language_v1.LanguageServiceClient.from_service_account_json(os.getenv("KEY_PATH"))
    type_ = language_v1.Document.Type.PLAIN_TEXT
    language = "en"
    document = {"content": text_content, "type_": type_, "language": language}
    content_categories_version = (
        language_v1.ClassificationModelOptions.V2Model.ContentCategoriesVersion.V2
    )
    response = client.classify_text(
        request={
            "document": document,
            "classification_model_options": {
                "v2_model": {"content_categories_version": content_categories_version}
            },
        }
    )
    return response.categories[0].name

@app.route('/api/data', methods=['GET'])
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

@app.route('/api/checkGrouping', methods=['POST'])
def checkgrouping():
    conversation_id = request.form['conversation_id']
    datareal = {}
    data = db.chats.find({'conversationId': conversation_id}).sort("createdAt", -1).limit(100)
    
    

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
                                min_cluster_size=3, gen_min_span_tree=True, prediction_data=True)
    clusterer.fit(norm_data)
    result = data_processing_for_get_content(np.flip(clusterer.labels_), np.flip(sentences))
    # json.loads()
    print(result)
    print("--------------------------------")
    final = {}
    for k, v in result.items():
        final[k] = {
            "name" : get_classifies(v)
        }
    
    user_list = get_user_list(clusterer.labels_, userList)
    for k,v in user_list.items():
        final[k]["userList"] = list(v)
        
    my_dict_converted = {
        str(k): v for k, v in get_cluster_dict(clusterer.labels_).items()}
    
    my_dict_converted2 = {
        str(k): v for k, v in final.items()}
    print(my_dict_converted2)
    json_string = json.dumps(my_dict_converted)
    requests.post(f'http://localhost:4000/api/notification/new', json={
        'conversationId': conversation_id,
        'data': json.dumps(my_dict_converted2)
    })
    return Response(json.dumps({'successful': True}), status=200, mimetype='application/json')


if __name__ == '__main__':
    app.run(port=5000, debug=True)
    # app.config['MONGO_URI'] = config['PROD']['DB_URI']
