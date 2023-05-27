require('dotenv').config();
const mongoose = require('mongoose');
const PushData = require('./push-data');
const PushDataSub = require('./push-data-sub');

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_SERVER, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        process.exit(1);
    }
}
console.log(process.env.CONVERSATIONID);

connect().then(() => {
    try {
        // PushData(
        //     +process.env.TIMEACTIVATED,
        //     mongoose.Types.ObjectId(process.env.CONVERSATIONID),
        //     process.env.CONVERSATIONNAME,
        //     process.env.FILE
        // );
        // PushDataSub(
        //     process.env.CONVERSATIONID,
        //     process.env.CONVERSATIONNAME,
        //     process.env.FILE,
        //     +process.env.NUMCHAT,
        //     process.env.CONVERSATIONTYPE
        // );
    } catch (error) {
        console.log(error);
    }
});
