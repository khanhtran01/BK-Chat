const authRoute = require('./auth');
const userRoute = require('./user');
const conversationRoute = require('./conversation');
const AuthenMiddleware = require('../app/middlewares/AuthenMiddleware');
const UserController = require('../app/controllers/UserController');
function route(app) {
    app.use('/api/user', AuthenMiddleware, userRoute);
    app.use('/api/conversation', AuthenMiddleware, conversationRoute);
    app.use('/api/auth', authRoute);
    app.use('/api/home', AuthenMiddleware, UserController.home);
}

module.exports = route;
