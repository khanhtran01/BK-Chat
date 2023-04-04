const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Chat = require('../models/Chat');
const ChatController = require('./ChatController');
const Neo4jController = require('./Neo4jController');
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
class ConversationController {
    async newContact(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email }, userDTOMini);
            if (user && user._id != req.userId) {
                const result = await Conversation.findOne({
                    type: 'single',
                    member: {
                        $all: [req.userId, user._id],
                    },
                });
                if (result) {
                    res.status(200).json({ isContact: true, successful: false });
                } else {
                    const conversation = await Conversation.create({
                        name: 'Name conversation',
                        type: 'single',
                        member: [req.userId, user._id],
                    });
                    await Chat.create({
                        conversationId: conversation._id,
                        userId: req.userId,
                        content: req.body.chat,
                        type: 'text',
                        userRead: [req.userId],
                    });
                    // Neo4jController.createContact(req, req.userId, user._id.toString());
                    res.status(200).json({ isContact: false, successful: true });
                }
            } else if (user) {
                res.status(200).json({ isContact: true, successful: false });
            } else {
                res.status(200).json({
                    message: 'User not found',
                    isContact: false,
                    successful: false,
                });
            }
        } catch (error) {
            next(error);
        }
    }
    async newGroup(req, res, next) {
        try {
            let member = req.body.idsUser;
            if (member.length < 2) {
                res.status(200).json({ message: 'Need more member', successful: false });
            } else {
                member.push(req.userId);
                const conversation = await Conversation.create({
                    name: req.body.groupName,
                    type: 'group',
                    member: member,
                    desc: req.body.groupDesc,
                });
                await Chat.create({
                    conversationId: conversation._id,
                    userId: req.userId,
                    content: req.body.chat,
                    type: 'text',
                    userRead: [req.userId],
                });
                res.status(200).json({ successful: true });
            }
        } catch (error) {
            next(error);
        }
    }
    async getConversation(req, res, next) {
        try {
            const conversationId = req.query.id;
            const numberChatReturn = 25;
            const numberMemberReturn = 25;
            const numberChatRead = 10;
            // if (!(await redis.exists(conversationId))) {
            // make sure user is in this conversation
            const conversation = await Conversation.findOne({
                _id: conversationId,
                member: req.userId,
            }).populate('member', userDTOMini);
            if (conversation) {
                // let conversationInCache = {
                //     conversation: conversation,
                // };
                const chatNeedRead = await Chat.find({ conversationId: conversationId }, { _id: 1 })
                    .sort({ createdAt: -1 })
                    .limit(numberChatRead);
                await Chat.updateMany(
                    {
                        conversationId: conversationId,
                        _id: { $in: chatNeedRead.map((e) => e._id) },
                    },
                    {
                        $addToSet: {
                            userRead: req.userId,
                        },
                    },
                );
                let member = conversation.member.slice();
                member = member.splice(0, numberMemberReturn);
                const chats = await Chat.find({ conversationId: conversationId }, chatDTO)
                    .populate('userId', userDTOMini)
                    .populate({
                        path: 'replyFrom',
                        select: 'userId content',
                        populate: { path: 'userId', select: '_id email username' },
                    })
                    .sort({ createdAt: -1 })
                    .limit(numberChatReturn);
                chats.reverse();
                // const chats = await ChatController.pagingChat(conversationId, 25, 1);
                // conversationInCache.chats = chats.reverse();
                // conversationInCache.numChat = chats.length > 25 ? numberChatReturn : chats.length;
                // await redis.set(conversationId, JSON.stringify(conversationInCache));
                res.status(200).json({ chats: chats, member: member, successful: true });
            } else {
                res.status(200).json({
                    message: 'User is not in that conversation',
                    successful: false,
                });
            }
            // } else {
            //     const conversationData = JSON.parse(await redis.get(conversationId));
            //     if (conversationData.conversation.member.some((e) => e._id == req.userId)) {
            //         const chatNeedRead = await Chat.find({ conversationId: conversationId }, { _id: 1 })
            //             .sort({ createdAt: -1 })
            //             .limit(numberChatRead);
            //         await Chat.updateMany(
            //             {
            //                 conversationId: conversationId,
            //                 _id: { $in: chatNeedRead.map((e) => e._id) },
            //             },
            //             {
            //                 $addToSet: {
            //                     userRead: req.userId,
            //                 },
            //             },
            //         );
            //         let member = conversationData.conversation.member.slice();
            //         member = member.splice(0, numberMemberReturn);
            //         res.status(200).json({
            //             chats: conversationData.chats,
            //             member: member,
            //             successful: true,
            //         });
            //     } else {
            //         res.status(200).json({
            //             message: 'User is not in that conversation',
            //             successful: false,
            //         });
            //     }
            // }
        } catch (error) {
            next(error);
        }
    }
    async pagingChat(req, res, next) {
        try {
            const numberChatReturn = 25;
            const chats = await ChatController.pagingChat(
                req.query.conversationId,
                req.query.chatId,
                numberChatReturn,
            );
            res.status(200).json({ chats: chats, successful: true });
        } catch (error) {
            next(error);
        }
    }
    async getAllContact(req, res, next) {
        try {
            let allContact = [];
            // if (!(await redis.exists(req.userId))) {
            let listConversation = await Conversation.find({
                member: req.userId,
                type: 'single',
            }).populate('member', userDTOMini);
            listConversation.forEach((conversation) => {
                if (conversation.member[0]._id != req.userId) {
                    allContact.push({
                        userId: conversation.member[0]._id,
                        username: conversation.member[0].username,
                    });
                } else {
                    allContact.push({
                        userId: conversation.member[1]._id,
                        username: conversation.member[1].username,
                    });
                }
            });
            // await redis.set(req.userId, JSON.stringify(allContact));
            // } else {
            //     allContact = JSON.parse(await redis.get(req.userId));
            // }
            res.status(200).json({ allContact: allContact, successful: true });
        } catch (error) {
            next(error);
        }
    }
    async getAllContactSort(req, res, next) {
        try {
            let listConversation = await Conversation.find({
                member: req.userId,
                type: 'single',
            }).populate('member', { password: 0, address: 0, desc: 0 });
            let allContactName = [];
            let allContact = [];
            let result = [];
            listConversation.forEach((conversation) => {
                if (conversation.member[0]._id == req.userId) {
                    allContactName.push(conversation.member[1].username);
                    allContact.push({
                        username: conversation.member[1].username,
                        conversationId: conversation._id,
                        avatar: conversation.member[1].avatar,
                    });
                } else {
                    allContactName.push(conversation.member[0].username);
                    allContact.push({
                        username: conversation.member[0].username,
                        conversationId: conversation._id,
                        avatar: conversation.member[0].avatar,
                    });
                }
            });
            allContactName.sort();
            allContactName.forEach((e) => {
                result.push(allContact.find((e1) => e1.username === e));
            });
            res.status(200).json({ allContactSort: result, successful: true });
        } catch (error) {
            next(error);
        }
    }

    async checkContact(req, res, next) {
        try {
            const conversationId = req.query.conversationId;
            let allContact = [];
            let listConversation = await Conversation.find({
                member: req.userId,
                type: 'single',
            }).populate('member', userDTOMini);
            listConversation.forEach((conversation) => {
                if (conversation.member[0]._id != req.userId) {
                    allContact.push({
                        userId: conversation.member[0]._id.toString(),
                        username: conversation.member[0].username,
                        avatar: conversation.member[0].avatar,
                    });
                } else {
                    allContact.push({
                        userId: conversation.member[1]._id.toString(),
                        username: conversation.member[1].username,
                        avatar: conversation.member[1].avatar,
                    });
                }
            });
            const conversation = await Conversation.findOne({
                _id: conversationId,
                member: req.userId,
            }).populate('member', { _id: 1 });
            const set = new Set();
            if (conversation) {
                for (const member of conversation.member) {
                    set.add(member._id.toString());
                }
                let result = allContact.filter((e) => !set.has(e.userId));
                res.status(200).json({ successful: true, allContact: result });
            } else {
                res.status(200).json({
                    message: 'User is not in that conversation',
                    successful: false,
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async addMemberGroup(req, res, next) {
        try {
            await Conversation.updateOne(
                { _id: req.body.conversationId },
                {
                    $addToSet: {
                        member: {
                            $each: req.body.idsUser,
                        },
                    },
                },
            );
            res.status(200).json({ successful: true });
        } catch (error) {
            next(error);
        }
    }
    async outGroup(req, res, next) {
        try {
            await Conversation.updateOne(
                { _id: req.query.conversationId },
                {
                    $pull: {
                        member: req.userId,
                    },
                },
            );
            res.status(200).json({ successful: true });
        } catch (error) {
            next(error);
        }
    }

    async getConversationForSugestion(req, res, next) {
        try {
            const now = new Date();
            const timeActive = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - +req.query.timeActive,
            );
            const conversations = await Conversation.find(
                {
                    type: 'group',
                    $expr: { $gte: [{ $size: '$member' }, 5] },
                    createdAt: { $lte: timeActive },
                },
                { _id: 1 },
            );
            res.status(200).json({ conversations: conversations, successful: true });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ConversationController();
