const authRoute = require('./auth');
const userRoute = require('./user');
const notificationRoute = require('./notification');
const conversationRoute = require('./conversation');
const AuthenMiddleware = require('../app/middlewares/AuthenMiddleware');
const ServiceMiddleware = require('../app/middlewares/ServiceMiddleware');
const UserController = require('../app/controllers/UserController');
const ConversationController = require('../app/controllers/ConversationController');
const NotificationController = require('../app/controllers/NotificationController');
const ChatController = require('../app/controllers/ChatController');
const Neo4jController = require('../app/controllers/Neo4jController');

function route(app) {
    app.use('/api/user', AuthenMiddleware, userRoute);
    // [POST] /api/notification/new
    app.post('/api/notification/new', NotificationController.new);
    app.post('/api/notification/new-single', NotificationController.newSingle);
    app.get('/api/neo4j/get-all', Neo4jController.getAllUser);

    app.use('/api/conversation', AuthenMiddleware, conversationRoute);
    app.use('/api/notification', AuthenMiddleware, notificationRoute);
    app.use('/api/auth', authRoute);

    // [GET] /api/home
    app.use('/api/home', AuthenMiddleware, UserController.home);
}

module.exports = route;
