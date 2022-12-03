const { createClient } = require('redis');
const redis = createClient({
    url: process.env.REDIS_URL,
});

async function connect() {
    redis.on('error', (err) => console.log('Redis Client Error', err));
    await redis.connect();
    console.log('Redis connect successful !!');
}
connect();

module.exports = redis;
