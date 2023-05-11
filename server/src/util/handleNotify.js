const NotificationController = require('../app/controllers/NotificationController');

var CronJob = require('cron').CronJob;

// 0 23 * * 0

const handleNotify = new CronJob(
    '0 23 * * 0',
    async function () {
        console.log('🚀 ~ Handle notification started');
        try {
            await NotificationController.validateNotifications();
        } catch (error) {
            console.log(error.message);
        }
    },
    null,
    true,
    'Asia/Ho_Chi_Minh',
);

module.exports = handleNotify;
