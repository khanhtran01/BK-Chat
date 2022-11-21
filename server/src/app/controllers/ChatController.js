const Conversation = require('../models/Conversation');
const Chat = require('../models/Chat');
class ChatController {
    async storeChatAndGetId(data) {
        try {
            await Chat
                .create({
                    conversationId: data.conversationId,
                    userId: data.sender._id,
                    content: data.content,
                    type: data.type,
                    userRead: [data.sender._id],
                    replyFrom: data.replyFromChatId,
                });
            await Conversation
                .updateOne({ _id: data.conversationId }, {
                    updatedAt: Date.now()
                })
            const chats = await Chat
                .findOne({ conversationId: data.conversationId })
                .sort({ 'createdAt': -1 });
            if (data.replyFromChatId) {
                const replyChat = await Chat.findOne(
                    { _id: data.replyFromChatId })
                    .populate('userId', { password: 0, address: 0, desc: 0 })
                return {
                    id: chats._id,
                    replyChat: replyChat
                }
            }
            return {
                id: chats._id,
                replyChat: null
            };
        } catch (error) {
            console.log(error);
            return null;
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
                .populate({
                    path: 'replyFrom',
                    select: 'userId content ',
                    populate: { path: 'userId', select: '_id email username' }
                })
                .limit(numChat)
                .skip(numSkip);
        } catch (error) {
            return false;
        }

    }

    async getChatForSuggestion(req, res, next) {
        try {
            const now = new Date();
            const backToDays = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - req.query.backToDays,
            );
            console.log(req.query.backToDays);
            let chats = await Chat.find({
                conversationId: req.query.conversationId,
                createdAt: {
                    $gte: backToDays,
                }
            })
            chats = chats.map(chat => {
                return {
                    time: chat.createdAt,
                    uid: chat.userId,
                    replyFrom: chat.replyFrom,
                    content: chat.content
                }
            })
            res.status(200).json({ chats, successful: true })
        } catch (error) {
            console.log(error);
            res.status(500).json({ successful: false })
        }

    }
}

module.exports = new ChatController();
