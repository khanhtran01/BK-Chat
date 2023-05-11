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
const chatDTO = {
    like: 0,
    totalLike: 0,
    userRead: 0,
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
                { countForSuggestion: 1, _id: 1, type: 1 },
            );

            if (thisConversation.type === 'group') {
                if (thisConversation.countForSuggestion >= 200) {
                    axios.post(
                        `${process.env.AI_URL}/api/checkGrouping`,
                        {
                            conversation_id: thisConversation._id,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        },
                    );

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
                if (user.countChat >= 100) {
                    axios.post(
                        `${process.env.AI_URL}/api/detectUserTopic`,
                        {
                            user_Id: user._id,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        },
                    );
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
                await Conversation.updateOne(
                    { _id: data.conversationId },
                    {
                        updatedAt: Date.now(),
                    },
                );
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
    async pagingChat(conversationId, lastChatId, size) {
        const chat = await Chat.findOne({ _id: lastChatId });
        const chats = await Chat.find(
            {
                conversationId: conversationId,
                createdAt: { $lt: new Date(chat.createdAt) },
            },
            chatDTO,
        )
            .populate('userId', userDTOMini)
            .populate({
                path: 'replyFrom',
                select: 'userId content',
                populate: { path: 'userId', select: '_id email username' },
            })
            .sort({ createdAt: -1 })
            .limit(size);
        return chats.reverse();
    }

    async findLastChat(conversationId) {
        try {
            const chat = await Chat.find({ conversationId: conversationId }).limit(1).sort({ createdAt: -1 });
            return chat[0];
        } catch (error) {
            return null;
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
