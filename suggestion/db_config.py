from app import app
from flask_pymongo import PyMongo
import os

from py2neo import Graph
def neo4j_auth():
    user = os.getenv("NEO4J_USERNAME")
    pword = os.getenv("NEO4J_PASSWORD")
    graph = Graph(os.getenv("NEO4J_URL"), user=user, password=pword)
    return graph


app.config['MONGO_URI'] = os.getenv("DB_CONNECT_PATH")
mongodb_client = PyMongo(app)


db = mongodb_client.db