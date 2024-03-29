const express = require('express');
const route = express.Router();
const uploads = require('../util/multer.cloudinary');
const UpdateInfoController = require('../app/controllers/UpdateInfoController');
const UserController = require('../app/controllers/UserController');

// [PUT] /api/user/update-personal-info (avatar, username, desc, address)
route.put('/update-personal-info', uploads.single('avatar'), UpdateInfoController.personalInfo);

// [GET] /api/user/search-contact?email= (email)
route.get('/search-contact', UserController.seachUser);

// [GET] /api/user/get-infor
route.get('/get-infor', UserController.personalInfo);

// [PUT] /api/user/change-password
route.put('/change-password', UserController.changePassword);

module.exports = route;
