
const jwt = require('jsonwebtoken');

module.exports = function verifyToken(token) {
    try {
        var checkToken = jwt.verify(token, process.env.JWT_SECRECT);
        if (checkToken) {
            return checkToken._id;
        } else {
            res.status(401).json({ message: "Token is not valid" });
        }
    } catch (error) {
        res.status(500).json(error)
    }
}