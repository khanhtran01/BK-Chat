const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chat = new Schema(
    {
        conversationId: { type: String },
        userId: {
            type: String,
            ref: 'User',
        },
        type: { type: String, enum: ['text'] },
        content: { type: String },
        like: { type: Array, default: [] },
        totalLike: { type: Number, default: 0 },
        userRead: { type: Array, default: [] },
        replyFrom: { type: String, default: null, ref: 'Chat' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Chat', Chat);
