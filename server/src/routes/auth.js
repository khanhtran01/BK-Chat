const express = require('express');
const route = express.Router();

const UserController = require('../app/controllers/UserController');

route.post('/login', UserController.checkLogin);

route.get('/logout', UserController.logout);

route.post('/register', UserController.storeAccount);

module.exports = route;
