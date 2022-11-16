const express = require('express');
const route = express.Router();
const NotificationController = require('../app/controllers/NotificationController');

// [POST] /api/notification/new 
route.post('/new', NotificationController.new);
// [GET] /api/notification/get 
route.get('/get', NotificationController.getAll);
// [PUT] /api/notification/accept
route.put('/accept-create', NotificationController.accept);

module.exports = route;
