const express = require('express');
const route = express.Router();
const NotificationController = require('../app/controllers/NotificationController');

// [GET] /api/notification/get 
route.get('/get', NotificationController.getAll);
// [PUT] /api/notification/action
route.put('/action', NotificationController.accept);

module.exports = route;
