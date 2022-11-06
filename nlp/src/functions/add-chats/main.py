import json
f = open('group_messages_bittrex.json')

def formatTo(number, heso):
    return str(number) +'a'* (heso-len(str(number)))

data = json.load(f)
data.reverse()
with open("final.json", "a") as outfile:
    n = 100
    outfile.write("""[""")
    for i in range(0, n):
        # json_object = json.dumps(data[i], indent=4)
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
            "update_At": None if "edit_date" not in data[i] else data[i]['edit_date'],
        }
        json_object = json.dumps(res, indent=4)
        outfile.write(json_object)
        if (i < n - 1):
            outfile.write(',')
    outfile.write("""]""")  