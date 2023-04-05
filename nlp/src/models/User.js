const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    email: { type: String, required: true, unique: true },
    googleId: { type: String, default: null },
    type: { type: String, enum: ['google', 'default'], default: 'default' },
    verify: { type: Boolean, default: false },
    uniqueString: { type: String },
    password: { type: String },
    username: { type: String },
    avatar: { type: String, default: null },
    address: { type: String, default: '' },
    desc: { type: String, default: '' },
    countChat: { type: String, default: 0 },
});

module.exports = mongoose.model('User', User);
