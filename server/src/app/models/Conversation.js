const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Conversation = new Schema(
    {
        name: { type: String },
        type: { type: String, enum: ['single', 'group'] },
        member: [{ type: String, ref: 'User' }],
        desc: { type: String, default: '' },
        avatar: { type: String, default: null },
        countForSuggestion: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Conversation', Conversation);
