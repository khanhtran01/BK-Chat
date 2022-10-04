const express = require('express');
const route = express.Router();
const uploads = require('../util/multer.cloudinary');
const UpdateInfoController = require('../app/controllers/UpdateInfoController');
const UserController = require('../app/controllers/UserController');
const ConversationController = require('../app/controllers/ConversationController');

// avatar, username, desc, address
route.put('/update-personal-info', uploads.single('avatar'), UpdateInfoController.personalInfor);

// route.post('/search-contact', UserController.seachUser);

// route.post('/new-contact', ConversationController.newMessage);

// route.get('/get-infor', UserController.personalInfo);

module.exports = route;
