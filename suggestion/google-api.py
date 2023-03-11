# from google.cloud import language_v1
# def get_classifies(text_content):
#     client = language_v1.LanguageServiceClient.from_service_account_json("/Users/baonk/Desktop/workspace/keys/bkchat-gcp-key.json")
#     type_ = language_v1.Document.Type.PLAIN_TEXT
#     language = "en"
#     document = {"content": text_content, "type_": type_, "language": language}
#     content_categories_version = (
#         language_v1.ClassificationModelOptions.V2Model.ContentCategoriesVersion.V2
#     )
#     response = client.classify_text(
#         request={
#             "document": document,
#             "classification_model_options": {
#                 "v2_model": {"content_categories_version": content_categories_version}
#             },
#         }
#     )
#     for category in response.categories:
#         print("Category name: {}".format(category.name))
#         print("Confidence: {}".format(category.confidence))
#     return None

# get_classifies("That actor on TV makes movies in Hollywood and also stars in a variety of popular new TV shows.")