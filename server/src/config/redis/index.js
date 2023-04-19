const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const redis = createClient({
    url: process.env.REDIS_URL,
});
const subClient = redis.duplicate();
async function connect(io) {
    redis.on('error', (err) => console.log('Redis Client Error', err));
    await redis.connect();
    await subClient.connect();
    io.adapter(createAdapter(redis, subClient));
    if (!(await redis.exists('userInSocket'))) {
        await redis.SET('userInSocket', '[]');
    }
    console.log('Redis connect successful !!');
}

module.exports = { redis, connect };
