require("dotenv").config();
const mongoose = require('mongoose');
const Conversation = require("../../models/Conversation");
const CleanData = require("./cleandb");
const GeneratorData = require('./gen-data');
const PushData = require("./push-data");
const sleep = require("./sleep");

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_SERVER, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect Successful !!');
    } catch (error) {
        console.log('Connect Failed !!');
        process.exit(1)
    }
}

connect();

// GeneratorData(process.env.STEP, process.env.NUMBER, process.env.MAX_HOURS)
PushData(15)
// CleanData(mongoose.Types.ObjectId('6344e91b89558fb2b5ec1234'))
// var moment = require('moment');
// const now1 = new Date('2019-11-07T00:27:08+00:00');
// const now2 = new Date()

// const time = new Date(
//     now1.getFullYear(),
//     now1.getMonth(),
//     now1.getDate() + 61,
//     now1.getHours(),
//     now1.getMinutes()
// );
// // const k = new Date('2019-11-30T15:28:16+00:00')
// // var hour = moment(time).format("HH:mm");
// // var date = moment(time).format("DD/MM");
// // console.log(hour + ' | ' + date);
// console.log(time); 

