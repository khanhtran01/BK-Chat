const authRoute = require('./auth');
const userRoute = require('./user');
const notificationRoute = require('./notification');
const conversationRoute = require('./conversation');
const AuthenMiddleware = require('../app/middlewares/AuthenMiddleware');
const UserController = require('../app/controllers/UserController');
const ConversationController = require('../app/controllers/ConversationController');
const NotificationController = require('../app/controllers/NotificationController');
const ChatController = require('../app/controllers/ChatController');
function route(app) {
    app.use('/api/user', AuthenMiddleware, userRoute);
    // [GET] /api/notification/sugestion 
    app.get('/api/conversation/sugestion', ConversationController.getConversationForSugestion);
    //  [GET] /api/chat/get?conversationId?backToDays=
    app.get('/api/chat/get', ChatController.getChatForSuggestion);
    // [POST] /api/notification/new 
    app.post('/api/notification/new', NotificationController.new);
    app.use('/api/conversation', AuthenMiddleware, conversationRoute);
    app.use('/api/notification', AuthenMiddleware, notificationRoute);
    app.use('/api/auth', authRoute);
    // [GET] /api/home
    app.use('/api/home', AuthenMiddleware, UserController.home);
}

module.exports = route;
