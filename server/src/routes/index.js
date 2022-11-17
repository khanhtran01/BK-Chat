const authRoute = require('./auth');
const userRoute = require('./user');
const notificationRoute = require('./notification');
const conversationRoute = require('./conversation');
const AuthenMiddleware = require('../app/middlewares/AuthenMiddleware');
const UserController = require('../app/controllers/UserController');
function route(app) {
    app.use('/api/user', AuthenMiddleware, userRoute);
    app.use('/api/conversation', AuthenMiddleware, conversationRoute);
    app.use('/api/notification', AuthenMiddleware, notificationRoute);
    app.use('/api/auth', authRoute);
    // [GET] /api/home
    app.use('/api/home', AuthenMiddleware, UserController.home);
}

module.exports = route;
