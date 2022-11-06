import json
import datetime

f = open('group_messages_bittrex.json')

def formatTo(number, heso):
    return str(number) +'a'* (heso-len(str(number)))

data = json.load(f)
data.reverse()

with open("final.json", "a") as outfile:
    n = len(data)
    lastTime = datetime.datetime.fromisoformat(data[-1]['date'])
    now = datetime.datetime.now()
    outfile.write("""[""")
    for i in range(0, n):
        timeSpace = lastTime - datetime.datetime.fromisoformat(data[i]['date'])
        # json_object = json.dumps(data[i], indent=4)
        if ("message" not in data[i]):
            continue
        if (data[i]['message'] == None):
            continue
        if ("from_id" not in data[i]):
            continue
        if (type(data[i]['from_id']) == type(None) or ("user_id" not in data[i]['from_id'])):
            continue
        created_At = (now - timeSpace).__str__()
        res = {
            "id": formatTo(data[i]['id'], 12),
            "message": None if "message" not in data[i] else data[i]['message'],
            "created_At" : created_At,
            "from_id" : formatTo(data[i]['from_id']['user_id'], 12),
            "reply_to" : None if type(data[i]['reply_to']) == type(None) else formatTo(data[i]['reply_to']['reply_to_msg_id'], 12),
            "update_At": None if "edit_date" not in data[i] else data[i]['edit_date'],
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