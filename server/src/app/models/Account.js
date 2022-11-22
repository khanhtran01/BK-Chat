const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    username: { type: String },
    avatar: { type: String, default: null },
    address: { type: String, default: '' },
    desc: { type: String, default: '' },
});

module.exports = mongoose.model('Account', Account);
