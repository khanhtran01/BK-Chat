const verifyToken = require('../../util/verifyToken');

module.exports = function AuthenMiddleware(req, res, next) {
    try {
        let accessKey = req.header("Authorization").split(" ")[1]
        verifyToken(accessKey);
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid", sucessful: false })
    }
}