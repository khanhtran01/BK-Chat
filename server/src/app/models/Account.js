const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    username: { type: String },
    password: { type: String },
    fullname: { type: String },
    avatar: { type: String },
    background_img: { type: String },
    desc: { type: String },
    email: { type: String },
});

module.exports = mongoose.model('Account', Account);
