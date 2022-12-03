const verifyToken = require('../../util/verifyToken');

module.exports = function AuthenMiddleware(req, res, next) {
    try {
        let token = req.header('Authorization').split(' ')[1];
        let checkToken = verifyToken(token);
        req.userId = checkToken;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid', sucessful: false });
    }
};
