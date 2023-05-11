var CronJob = require('cron').CronJob;
const axios = require('axios');
// 0 23 * * 0

const checkRecommend = new CronJob(
    '0 22 * * 0',
    async function () {
        console.log('🚀 ~ Check Recommend started');
        try {
            await axios.get(`${process.env.AI_URL}/api/get-recommend-group`);
        } catch (error) {
            console.log(error.message);
        }
    },
    null,
    true,
    'Asia/Ho_Chi_Minh',
);

module.exports = checkRecommend;
