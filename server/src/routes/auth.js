const express = require('express');
const route = express.Router();

const AuthenController = require('../app/controllers/AuthenController');
// [POST] /api/auth/login
route.post('/login', AuthenController.checkLogin);

// [GET] /api/auth/logout
route.get('/logout', AuthenController.logout);

// [POST] /api/auth/register
route.post('/register', AuthenController.storeAccount);

// [GET] /api/auth/verify-token
route.get('/verify-token', AuthenController.checkToken);

// [GET] /api/auth/verify-email?email=xx&token=xx
route.get('/verify-email', AuthenController.verifyEmail);

route.post('/service', AuthenController.authService);

module.exports = route;
