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
        console.log('Connect Successful !!');
    } catch (error) {
        console.log('Connect Failed !!');
        process.exit(1);
    }
}

connect().then(() => {
    try {
        // PushData(
        //     +process.env.TIMEACTIVATED,
        //     mongoose.Types.ObjectId(process.env.CONVERSATIONID),
        //     process.env.CONVERSATIONNAME,
        //     process.env.FILE
        // );
        PushDataSub(
            process.env.CONVERSATIONID,
            process.env.CONVERSATIONNAME,
            process.env.FILE,
            +process.env.NUMCHAT
        );
    } catch (error) {
        console.log(error);
    }
});
