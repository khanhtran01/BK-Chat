const NotificationController = require('../app/controllers/NotificationController');

var CronJob = require('cron').CronJob;

// 0 23 * * 0

const handleNotify = new CronJob(
    '0 23 * * 0',
    async function () {
        console.log('🚀 ~ Cron job started');
        await NotificationController.validateNotifications();
    },
    null,
    true,
    'Asia/Ho_Chi_Minh',
);

module.exports = handleNotify;
