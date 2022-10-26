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

// route.post('/group-update-info', uploads.single('groupAva') , UpdateInfoController.groupMessInfo);

// route.post('/add-member-group', ConversationController.addMemberGroup);

// route.post('/out-group', ConversationController.outGroup);

// [GET] /api/conversation/get-all-contact
route.get('/get-all-contact', ConversationController.getAllContact); // use for user online, offline

// [GET] /api/conversation/get-all-contact-sort
route.get('/get-all-contact-sort', ConversationController.getAllContactSort);

// [GET] /api/conversation/paging-chat?conversationId=xxx&page=x
route.get('/paging-chat', ConversationController.pagingChat);

// [GET] /api/conversation?id=
route.get('/', ConversationController.getConversation);

module.exports = route;
