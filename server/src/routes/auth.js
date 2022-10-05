const express = require('express');
const route = express.Router();

const UserController = require('../app/controllers/UserController');
// email, password
route.post('/login', UserController.checkLogin);

route.get('/logout', UserController.logout);

// email, username, password
route.post('/register', UserController.storeAccount);

module.exports = route;
