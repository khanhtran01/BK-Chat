var CronJob = require('cron').CronJob;
var job = new CronJob(
    '00 30 11 * * 1-5',
    function () {
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
    },
    function () {
        /* This function is executed when the job stops */
    },
    true /* Start the job right now */,
    timeZone /* Time zone of this job. */,
);

var job = new CronJob(
    '* * * * * *',
    function () {
        console.log('You will see this message every second');
    },
    null,
    true,
    'Asia/Ho_Chi_Minh',
);
