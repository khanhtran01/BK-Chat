from dotenv import load_dotenv
from app import app


from routes import testmodel, checkgrouping, test, get_recommend_group, detectUserTopic

load_dotenv()

app.add_url_rule('/testmodel',testmodel)

app.add_url_rule('/api/checkGrouping', view_func=checkgrouping, methods=['POST'])

app.add_url_rule('/api/data', view_func=test, methods=['GET'])

app.add_url_rule('/api/get-recommend-group', view_func=get_recommend_group, methods=['GET'])

app.add_url_rule('/api/detectUserTopic', view_func=detectUserTopic, methods=['POST'])

if __name__ == '__main__':
    app.run(port=5000, debug=True)
