require("dotenv").config();
const mongoose = require('mongoose');
const GeneratorData = require('./utils/gen-data')

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_TEST_SERVER, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect Successful !!');
    } catch (error) {
        console.log('Connect Failed !!');
    }
}

connect();

GeneratorData()







