import json

f = open('./dataset/group_messages_binance.json')

def formatTo(number, heso):
    return str(number) +'a'* (heso-len(str(number))) # trùng id

data = json.load(f)
data.reverse()

with open("./dataset/group_messages_binancee.json", "a") as outfile:
    n = len(data)
    outfile.write("""[""")
    for i in range(0, n):
        if ("message" not in data[i]):
            continue
        if (data[i]['message'] == None):
            continue
        if ("from_id" not in data[i]):
            continue
        if (type(data[i]['from_id']) == type(None) or ("user_id" not in data[i]['from_id'])):
            continue
        res = {
            "id": formatTo(data[i]['id'], 12),
            "message": None if "message" not in data[i] else data[i]['message'],
            "created_At" : data[i]['date'],
            "from_id" : formatTo(data[i]['from_id']['user_id'], 12),
            "reply_to" : None if type(data[i]['reply_to']) == type(None) else formatTo(data[i]['reply_to']['reply_to_msg_id'], 12),
        }
        json_object = json.dumps(res, indent=4)
        outfile.write(json_object)
        if (i < n - 1):
            outfile.write(',')
    outfile.write("""]""")  


# import time
# import datetime
# time_str = "2019-10-23T15:28:16+00:00"


# time_obj = datetime.datetime.fromisoformat(time_str).replace(tzinfo=None)

# import json
# f = open('final.json')

# data = json.load(f)

# firstTime = data[0]['created_At']
# lastTime = data[-1]['created_At']
# timeSpace = datetime.datetime.fromisoformat(lastTime) - datetime.datetime.fromisoformat(firstTime)
# print(timeSpace)

# newFirstTime = datetime.datetime.now() - timeSpace
# print(type(time_str))

# import time
# import datetime
# time_str = "2019-10-23T15:28:16+00:00"


# time_obj = datetime.datetime.fromisoformat(time_str).replace(tzinfo=None)

# import json
# f = open('final.json')

# data = json.load(f)

# firstTime = data[0]['created_At']
# lastTime = data[-1]['created_At']
# timeSpace = datetime.datetime.fromisoformat(lastTime) - datetime.datetime.fromisoformat(firstTime)
# print(timeSpace)

# newFirstTime = datetime.datetime.now() - timeSpace
# print(type(newFirstTime.__str__()))
# print(datetime.datetime.now())

# print(time_obj)

# print(datetime.datetime.now() - time_obj)