from app import app
from flask_pymongo import PyMongo
import os

from py2neo import Graph
def neo4j_auth():
    user = 'neo4j'
    pword = 'rXvCXjwjhBzAwYIerp3271aUxN9cBua4rkvQJVYBY2M'
    graph = Graph("neo4j+s://835db619.databases.neo4j.io", user=user, password=pword)
    return graph


app.config['MONGO_URI'] = os.getenv("DB_CONNECT_PATH")
mongodb_client = PyMongo(app)


db = mongodb_client.db