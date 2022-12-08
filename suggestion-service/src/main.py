import requests
import os
from dotenv import load_dotenv
load_dotenv()


MAINSERVICE = os.getenv("MAINSERVICE")
BACKTODAY = os.getenv("BACKTODAY")
TIMEACTIVE = os.getenv("TIMEACTIVE")
ACCESSKEY = os.getenv("ACCESSKEY")


def runSuggestion(chats):
    return chats

def checkResponse(response):
    if response.status_code == 200 and response.json()['successful']:
        return True
    return False

def main():
    responseAuth = requests.post(f'{MAINSERVICE}/api/auth/service', json={
        'accessKey': ACCESSKEY
    })
    responseAuth.raise_for_status()
    token = responseAuth.json()['accessKey']
    responseConversation = requests.get(f'{MAINSERVICE}/api/conversation/sugestion?timeActive={TIMEACTIVE}', headers = {
        'Authorization': f'Bearer {token}'
    })
    responseConversation.raise_for_status()
    for element in responseConversation.json()['conversations']:
        conversationId = element['_id']
        responseChat = requests.get(f'{MAINSERVICE}/api/chat/get?conversationId={conversationId}&backToDays={BACKTODAY}', headers = {
            'Authorization': f'Bearer {token}'
        })
        responseChat.raise_for_status()
        result = runSuggestion(responseChat.json()['chats'])
        print(result[0])
        # responseNotify = requests.post(f'{MAINSERVICE}/api/notification/new', json = {
        #     'member': result,
        #     'conversationId': conversationId
        # }, headers = {
        #     'Authorization': f'Bearer {token}'
        # })
        # responseNotify.raise_for_status()

try:
    main()
except requests.exceptions.HTTPError as errh:
    print("HTTP error:")
    print(errh)
except requests.exceptions.ConnectionError as errc:
    print("ConnectionError:")
    print(errc)
except requests.exceptions.Timeout as errt:
    print("Timeout:")
    print("Timeout" + errt)
except requests.exceptions.RequestException as err:
    print("RequestException:")
    print("RequestException:" + err)
