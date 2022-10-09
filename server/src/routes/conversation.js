const express = require('express');
const route = express.Router();
const uploads = require('../util/multer.cloudinary');
const ConversationController = require('../app/controllers/ConversationController');
const ChatController = require('../app/controllers/ChatController');
const UpdateInfoController = require('../app/controllers/UpdateInfoController');

// [POST] /api/conversation/new-contact
route.post('/new-contact', ConversationController.newMessage);

// route.post('/new-group', ConversationController.newGroupMessage);

// route.post('/read-chat', ChatController.addUserReadChat);

// route.post('/group-update-info', uploads.single('groupAva') , UpdateInfoController.groupMessInfo);

// route.post('/add-member-group', ConversationController.addMemberGroup);

// route.post('/out-group', ConversationController.outGroup);

// route.get('/get-all-contact', ConversationController.getAllContact);

// [GET] /api/conversation/get-all-contact-sort
route.get('/get-all-contact-sort', ConversationController.getAllContactSort);

// route.get('/paging-chat', ConversationController.pagingChat);

// [GET] /api/conversation?id=
route.get('/', ConversationController.getMessage);

module.exports = route;
