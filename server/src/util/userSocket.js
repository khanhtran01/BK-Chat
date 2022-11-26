const redis = require('../config/redis')

module.exports = {

    addUser: async (userId, socketId) => {
        if (userId && !await redis.sIsMember('users', userId)) {
            await redis.sAdd('users', userId)
            await redis.SET(userId, socketId)
        } else if (userId) {
            await redis.SET(userId, socketId)
        }
        // !users.some((user) => user.userId === userId) &&
        //     users.push({ userId, socketId });
    },

    removeUser: async (socketId) => {
        for await (const userId of redis.sScanIterator('users')) {
            if (await redis.get(userId) === socketId) {
                await redis.expire(userId, -1)
                await redis.sRem('users', userId)
            }
        }
        // users = users.filter((user) => user.socketId !== socketId);
    },

    getUser: async (userId) => {
        if (userId && await redis.exists(userId)) {
            return {
                userId,
                socketId: await redis.get(userId)
            }
        }
        // return users.find((user) => user.userId === userId);
    },
    getUserBySocketId: async (socketId) => {
        for await (const userId of redis.sScanIterator('users')) {
            if (await redis.get(userId) === socketId) {
                return {
                    userId,
                    socketId
                }
            }
        }
        // return users.find((user) => user.socketId === socketId);
    },
    getStatusUsers: async (listUser) => {
        let result = [];
        for (const element of listUser) {
            if (element.type == 'single') {
                if (await redis.exists(element.userId)) {
                    result.push(element)
                }
            }
        }
        return result;
    }
}