let users;
let redis;
if (process.env.NODE_ENV === 'production') {
    redis = require('../config/redis');
} else {
    users = [];
}
module.exports = {
    addUser: async (userId, socketId) => {
        if (process.env.NODE_ENV === 'production') {
            if (userId && !(await redis.sIsMember('users', userId))) {
                await redis.sAdd('users', userId);
                await redis.SET(userId, socketId);
            } else if (userId) {
                await redis.SET(userId, socketId);
            }
        } else {
            !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
        }
    },

    removeUser: async (socketId) => {
        if (process.env.NODE_ENV === 'production') {
            for await (const userId of redis.sScanIterator('users')) {
                if ((await redis.get(userId)) === socketId) {
                    await redis.expire(userId, -1);
                    await redis.sRem('users', userId);
                }
            }
        } else {
            users = users.filter((user) => user.socketId !== socketId);
        }
    },

    getUser: async (userId) => {
        if (process.env.NODE_ENV === 'production') {
            if (userId && (await redis.exists(userId))) {
                return {
                    userId,
                    socketId: await redis.get(userId),
                };
            }
        } else {
            return users.find((user) => user.userId === userId);
        }
    },
    getUserBySocketId: async (socketId) => {
        if (process.env.NODE_ENV === 'production') {
            for await (const userId of redis.sScanIterator('users')) {
                if ((await redis.get(userId)) === socketId) {
                    return {
                        userId,
                        socketId,
                    };
                }
            }
        } else {
            return users.find((user) => user.socketId === socketId);
        }
    },
    getStatusUsers: async (listUser) => {
        let result = [];
        if (process.env.NODE_ENV === 'production') {
            for (const element of listUser) {
                if (element.type == 'single') {
                    if (await redis.exists(element.userId)) {
                        result.push(element);
                    }
                }
            }
        } else {
            listUser.forEach((element) => {
                if (element.type == 'single') {
                    if (users.find((user) => user.userId === element.userId)) {
                        result.push(element);
                    }
                }
            });
        }
        return result;
    },
};
