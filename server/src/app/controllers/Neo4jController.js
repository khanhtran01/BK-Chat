const getSession = require('../../config/neo4j');

const User = require('../models/neo4j/user.neo4j');
const Topic = require('../models/neo4j/topic.neo4j');

class Neo4jController {
    async getAllUser(req, res, next) {
        try {
            const user = await User.getAll(getSession(req));
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
    async createUser(req, userId, username) {
        await User.create(getSession(req), userId, username);
    }

    async createContact(req, user1, user2) {
        await User.createContact(getSession(req), user1, user2);
    }
}

module.exports = new Neo4jController();
