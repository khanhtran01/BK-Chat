const getSession = require('../../config/neo4j');

const User = require('../models/neo4j/user.neo4j');

class Neo4jController {
    async getAllUser(req, res, next) {
        try {
            const user = await User.getAll(getSession(req));
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new Neo4jController();
