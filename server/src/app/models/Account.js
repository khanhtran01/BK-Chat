const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    email: { type: String },
    password: { type: String },
    username: { type: String },
    avatar: { type: String },
    address: { type: String },
    desc: { type: String },
});

module.exports = mongoose.model('Account', Account);
