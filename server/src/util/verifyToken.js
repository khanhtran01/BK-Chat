
const jwt = require('jsonwebtoken');

module.exports = function verifyToken(token) {
    try {
        var checkToken = jwt.verify(token, process.env.JWT_SECRECT);
        return checkToken._id;
    } catch (error) {
        res.status(500).json(error)
    }
}