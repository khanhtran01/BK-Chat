from google.cloud import language_v1
from dotenv import load_dotenv
import os
import numpy as np

load_dotenv()

def get_all_friends(refactor_data, access_list, element):
    if element in access_list:
        # print("reject  " + element)
        return []
    
    friend_list = refactor_data[element]
    access_list.append(element)
    res= [element]
    for i in friend_list:
        # print("store  " + str(access_list))
        # print("in  " + str(element)+ " add "+ str(i))
        res = res + get_all_friends(refactor_data, access_list, i)
        # print("res " + str(res))
    return res


def get_user_list(labels, userList, reject_list):
    group_dict = {}
    for i in range(len(labels)):
        if (labels[i] == -1 or (labels[i] in reject_list)):
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


def data_processing_for_get_content(cluster, chat_data, reject_list):
    result = {}
    count_prev1 = 0
    for i in range(len(cluster)):
        if ((cluster[i] == -1) or (cluster[i] in reject_list)):
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
    client = language_v1.LanguageServiceClient.from_service_account_json(
        os.getenv("KEY_PATH"))
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


def cosine(u, v):
    return np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))