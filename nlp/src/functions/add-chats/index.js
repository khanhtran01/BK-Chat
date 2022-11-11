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
PushData(+process.env.TIMEACTIVATED, mongoose.Types.ObjectId(process.env.CONVERSATIONID))
// CleanData(mongoose.Types.ObjectId(process.env.CONVERSATIONID))
