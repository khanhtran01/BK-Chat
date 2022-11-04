const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_TEST_SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect Successful !!");
  } catch (error) {
    console.log(error);
    console.log("Connect Failed !!");
  }
}

module.exports = { connect };
