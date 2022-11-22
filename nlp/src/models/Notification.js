const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Member = new Schema({
    userId: { type: String, ref: 'Account' },
    accept: {
        type: String,
        enum: ['accept', 'reject', 'none'],
        default: 'none'
    }
})

const Notification = new Schema({
    conversationId: { type: String, ref: 'Conversation' },
    members: [Member],
    status: {
        type: String,
        enum: ['done', 'pending', 'reject'],
        default: 'pending'
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Notification', Notification);
