const axios = require('axios');
const Conversation = require('../models/Conversation');
const Chat = require('../models/Chat');
const User = require('../models/User');
// const { redis } = require('../../config/redis');
const userDTOMini = {
    _id: 1,
    email: 1,
    username: 1,
    avatar: 1,
};
class ChatController {
    async storeChatAndGetId(data) {
        try {
            const chat = await Chat.create({
                conversationId: data.conversationId,
                userId: data.sender._id,
                content: data.content,
                type: data.type,
                userRead: [data.sender._id],
                replyFrom: data.replyFromChatId,
            });
            const thisConversation = await Conversation.findOne(
                { _id: data.conversationId },
                { countForSuggestion: 1, _id: 1 },
            );
            if (thisConversation.type === 'group') {
                if (thisConversation.countForSuggestion >= 1000) {
                    axios.post('localhost:5000/api/checkGrouping', {
                        conversation_id: thisConversation._id,
                    });
                    await Conversation.updateOne(
                        { _id: data.conversationId },
                        {
                            updatedAt: Date.now(),
                            countForSuggestion: 0,
                        },
                    );
                } else {
                    await Conversation.updateOne(
                        { _id: data.conversationId },
                        {
                            updatedAt: Date.now(),
                            $inc: {
                                countForSuggestion: 1,
                            },
                        },
                    );
                }
            } else {
                const user = await User.findOne({ _id: data.sender._id }, { countChat: 1 });
                if (user.countChat > 150) {
                    axios.post('localhost:5000/api/detectUserTopic', {
                        userId: user._id,
                    });
                    await User.updateOne(
                        { _id: data.sender._id },
                        {
                            countChat: 0,
                        },
                    );
                } else {
                    await User.updateOne(
                        { _id: data.sender._id },
                        {
                            $inc: {
                                countChat: 1,
                            },
                        },
                    );
                }
            }
            let replyChat = null;
            if (data.replyFromChatId) {
                replyChat = await Chat.findOne({ _id: data.replyFromChatId }).populate('userId', userDTOMini);
                return {
                    id: chat._id,
                    replyChat: replyChat,
                };
            }
            // const conversationData = JSON.parse(await redis.get(data.conversationId));
            // if (parseInt(conversationData.numChat) < 50) {
            //     conversationData.chats.push({
            //         _id: chat._id,
            //         conversationId: data.conversationId,
            //         userId: {
            //             _id: data.sender._id,
            //             email: data.sender.email,
            //             username: data.sender.username,
            //             avatar: data.sender.avatar,
            //         },
            //         content: data.content,
            //         type: data.type,
            //         replyFrom: replyChat,
            //         createdAt: chat.createdAt,
            //     });
            //     conversationData.numChat += 1;
            //     await redis.set(data.conversationId, JSON.stringify(conversationData));
            // } else {
            //     await redis.expire(data.conversationId, -1);
            // }
            return {
                id: chat._id,
                replyChat: replyChat,
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
            await Chat.updateOne(
                { _id: req.query.chatId },
                {
                    $addToSet: {
                        userRead: req.userId,
                    },
                },
            );
            res.status(200).json({ successful: true });
        } catch (error) {
            next(error);
        }
    }
    async pagingChat(conversationId, size, page) {
        try {
            const count = await Chat.find({ conversationId: conversationId }).count();
            let numSkip, numChat;
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
            return await Chat.find({ conversationId: conversationId })
                .populate('userId', userDTOMini)
                .populate({
                    path: 'replyFrom',
                    select: 'userId content',
                    populate: { path: 'userId', select: '_id email username' },
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
            let chats = await Chat.find({
                conversationId: req.query.conversationId,
                createdAt: {
                    $gte: backToDays,
                },
            });
            chats = chats.map((chat) => {
                return {
                    time: chat.createdAt,
                    uid: chat.userId,
                    replyFrom: chat.replyFrom,
                    content: chat.content,
                };
            });
            res.status(200).json({ chats, successful: true });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ChatController();
