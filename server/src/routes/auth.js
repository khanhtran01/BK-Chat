const express = require('express');
const route = express.Router();

const UserController = require('../app/controllers/UserController');
// [POST] /api/auth/login 
route.post('/login', UserController.checkLogin);

// [GET] /api/auth/logout
route.get('/logout', UserController.logout);

// [POST] /api/auth/register
route.post('/register', UserController.storeAccount);

// [GET] /api/auth/verify-token
route.get('/verify-token', UserController.checkToken);

module.exports = route;
