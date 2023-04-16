const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Member = new Schema({
    userId: { type: String, ref: 'User' },
    status: {
        type: String,
        enum: ['accept', 'reject', 'pending'],
        default: 'pending',
    },
});

const Notification = new Schema(
    {
        conversationId: { type: String, ref: 'Conversation' },
        member: [Member],
        status: {
            type: String,
            enum: ['accept', 'reject', 'pending'],
            default: 'pending',
        },
        topic: { type: String },
        confidence: { type: String, default: '' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Notification', Notification);
