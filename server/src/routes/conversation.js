const express = require('express');
const route = express.Router();
const uploads = require('../util/multer.cloudinary');
const ConversationController = require('../app/controllers/ConversationController');
const ChatController = require('../app/controllers/ChatController');
const UpdateInfoController = require('../app/controllers/UpdateInfoController');

// [POST] /api/conversation/new-contact
route.post('/new-contact', ConversationController.newContact);

// [POST] /api/conversation/new-group
route.post('/new-group', ConversationController.newGroup);

// [GET] /api/conversation/read-chat?chatId=
route.get('/read-chat', ChatController.addUserReadChat); // read chat nay luon neu no dang o ngay trang do

// [PUT] /api/conversation/update-group-info (conversation, groupAvatar, groupName, groupDesc)
route.put('/update-group-info', uploads.single('groupAvatar'), UpdateInfoController.groupInfo);

// [GET] /api/conversation/check-contact-group?conversationId=  (conversationId)
route.get('/check-contact-group', ConversationController.checkContact);

// [PUT] /api/conversation/add-member  (conversationId, idsUser)
route.put('/add-member', ConversationController.addMemberGroup);

// [GET] /api/conversation/out-group?conversationId=xx
route.get('/out-group', ConversationController.outGroup);

// [GET] /api/conversation/get-all-contact
route.get('/get-all-contact', ConversationController.getAllContact); // use for user online, offline

// [GET] /api/conversation/get-all-contact-sort
route.get('/get-all-contact-sort', ConversationController.getAllContactSort);

// [GET] /api/conversation/paging-chat?conversationId=xxx&chatId=xxx
route.get('/paging-chat', ConversationController.pagingChat);

// [GET] /api/conversation?id=
route.get('/', ConversationController.getConversation);

module.exports = route;
