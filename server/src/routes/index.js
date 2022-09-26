const authRoute = require('./auth');
// const userRoute = require('./user');
// const messageRoute = require('./message');
const AuthenMiddleware = require('../app/middlewares/AuthenMiddleware');
const UserController = require('../app/controllers/UserController');
function route(app) {
    // app.use('/api/user', AuthenMiddleware, userRoute);
    // app.use('/api/message', AuthenMiddleware, messageRoute);
    app.use('/api/auth', authRoute);
    app.use('/api', AuthenMiddleware, UserController.index);
}

module.exports = route;
