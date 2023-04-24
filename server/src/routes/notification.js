const express = require('express');
const route = express.Router();
const NotificationController = require('../app/controllers/NotificationController');

// [GET] /api/notification/get
route.get('/get', NotificationController.getAll);
// [PUT] /api/notification/action [notifyId, action, conversationId]
route.put('/action', NotificationController.action);

module.exports = route;
