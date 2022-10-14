const Conversation = require('../models/Conversation');
const Chat = require('../models/Chat');
class ChatController {
    async storeChatAndGetId(data) {
        try {
            await Chat
                .create({
                    conversationId: data.conversationId,
                    userId: data.senderId,
                    content: data.content,
                    type: data.type,
                    userRead: [data.senderId],
                    replyFrom: data.replyFrom,
                });
            await Conversation
                .updateOne({ _id: data.conversationId }, {
                    updatedAt: Date.now()
                })
            const chats = await Chat
                .findOne({ conversationId: data.conversationId })
                .sort({ 'createdAt': -1 });
            return chats._id;
        } catch (error) {
            console.log(error);
        }
    }
    // async addReactionChat(data) {
    //     try {
    //         const chat = await Chat
    //             .findOne({ _id: data.chat_id })
    //         if (chat.like.includes(data.senderId)) {
    //             await Chat
    //                 .updateOne({ _id: data.chat_id }, {
    //                     $pull: {
    //                         like: data.senderId
    //                     },
    //                     $inc: {
    //                         totalLike: -1
    //                     }
    //                 })
    //         } else {
    //             await Chat
    //                 .updateOne({ _id: data.chat_id }, {
    //                     $addToSet: {
    //                         like: data.senderId
    //                     },
    //                     $inc: {
    //                         totalLike: 1
    //                     }
    //                 })
    //         }
    //         const newChat = await Chat
    //             .findOne({ _id: data.chat_id })
    //         return newChat.totalLike;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    async addUserReadChat(req, res, next) {
        try {
            await Chat
                .updateOne({ _id: req.query.chatId }, {
                    $addToSet: {
                        userRead: req.userId
                    },
                })
            res.status(200).json({ successful: true })
        } catch (error) {
            res.status(500).json({ successful: false })
        }
    }
    async pagingChat(conversationId, size, page) {
        try {
            const count = await Chat.find({ conversationId: conversationId }).count();
            var numSkip, numChat;
            if (count - size * page < 0) {
                numSkip = 0;
                numChat = count - size * (page - 1);
                if (numChat <= 0) {
                    return false;
                }
            } else {
                numSkip = count - size * page;
                numChat = size;
            }
            return await Chat
                .find({ conversationId: conversationId })
                .populate('userId', { password: 0, address: 0, desc: 0 })
                .populate('replyFrom')
                .limit(numChat)
                .skip(numSkip);
        } catch (error) {
            res.status(500).json({ successful: false });
        }

    }
}

module.exports = new ChatController();
