let users;
let redis;
if (process.env.NODE_ENV === 'production') {
    const redisConnect = require('../config/redis');
    redis = redisConnect.redis;
} else {
    users = [];
}
module.exports = {
    addUser: async (userId, socketId) => {
        if (process.env.NODE_ENV === 'production') {
            if (userId) {
                let users = JSON.parse(await redis.get('userInSocket'));
                let flag = false
                for (let i = 0; i < users.length; i++) {
                    if (users[i].userId === userId) {
                        flag = true;
                        users[i].socketId = socketId;
                    }
                }
                !flag && users.push({ userId, socketId })
                await redis.set('userInSocket', JSON.stringify(users))
            }
        } else {
            !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
        }
    },

    removeUser: async (socketId) => {
        if (process.env.NODE_ENV === 'production') {
            let users = JSON.parse(await redis.get('userInSocket'));
            users = users.filter((user) => user.socketId !== socketId);
            await redis.set('userInSocket', JSON.stringify(users))
        } else {
            users = users.filter((user) => user.socketId !== socketId);
        }
    },

    getUser: async (userId) => {
        if (process.env.NODE_ENV === 'production') {
            let users = JSON.parse(await redis.get('userInSocket'));
            return users.find((user) => user.userId === userId);
        } else {
            return users.find((user) => user.userId === userId);
        }
    },
    getUserBySocketId: async (socketId) => {
        if (process.env.NODE_ENV === 'production') {
            let users = JSON.parse(await redis.get('userInSocket'));
            return users.find((user) => user.socketId === socketId);
        } else {
            return users.find((user) => user.socketId === socketId);
        }
    },
    getStatusUsers: async (listUser) => {
        let result = [];
        if (process.env.NODE_ENV === 'production') {
            let users = JSON.parse(await redis.get('userInSocket'));
            listUser.forEach((element) => {
                if (element.type == 'single') {
                    if (users.find((user) => user.userId === element.userId)) {
                        result.push(element);
                    }
                }
            });
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
