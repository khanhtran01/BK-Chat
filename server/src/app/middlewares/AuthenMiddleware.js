const Account = require('../models/Account');
const verifyToken = require('../../util/verifyToken');

module.exports = function AuthenMiddleware(req, res, next) {
    try {
        var token = req.header("Authorization").split(" ")[1]
        var checkToken = verifyToken(token);
        if (checkToken) {
            req.userId = checkToken;
            next();
        } else {
            res.status(401).json({ message: "Token is not valid" })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}