const Account = require('../models/Account');
const verifyToken = require('../../util/verifyToken');

module.exports = function AuthenMiddleware(req, res, next) {
    try {
        var token = req.signedCookies.token;
        var checkToken = verifyToken(token);
        if (checkToken) {
            req.userId = checkToken;
            next();
        } else {
            res.status(400).json({"message": "Not login"})
        }
    } catch (error) {
        res.status(400).json({"message": "Not login"})
    }
}