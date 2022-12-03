const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Chat = require('../models/Chat');
const ChatController = require('./ChatController');
class ConversationController {
    async newContact(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email }, { password: 0, address: 0, desc: 0 });
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
            res.status(500).json({ successful: false });
        }
    }
    async newGroup(req, res) {
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
            res.status(500).json({ successful: false });
        }
    }
    async getConversation(req, res) {
        try {
            const conversationId = req.query.id;
            // make sure user is in this conversation
            const conversation = await Conversation.findOne({
                _id: conversationId,
                member: req.userId,
            });
            // .populate('member');
            if (conversation) {
                await Chat.updateMany(
                    { conversationId: conversationId },
                    {
                        $addToSet: {
                            userRead: req.userId,
                        },
                    },
                );
                let chats = await ChatController.pagingChat(conversationId, 25, 1);
                res.status(200).json({ chats: chats, successful: true });
            } else {
                res.status(200).json({
                    message: 'User is not in that conversation',
                    successful: false,
                });
            }
        } catch (error) {
            res.status(500).json({ successful: false });
        }
    }
    async pagingChat(req, res) {
        try {
            const chats = await ChatController.pagingChat(req.query.conversationId, 8, req.query.page);
            res.status(200).json({ chats: chats, successful: true });
        } catch (error) {
            res.status(500).json({ successful: false });
        }
    }
    async getAllContact(req, res) {
        try {
            let listConversation = await Conversation.find({
                member: req.userId,
                type: 'single',
            }).populate('member', { password: 0, address: 0, desc: 0 });
            let allContact = [];
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
            res.status(200).json({ allContact: allContact, successful: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ successful: false });
        }
    }
    async getAllContactSort(req, res) {
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
            // console.log(error);
            res.status(500).json({ successful: false });
        }
    }
    async addMemberGroup(req, res) {
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
            res.status(500).json({ successful: false });
        }
    }
    async outGroup(req, res) {
        try {
            await Conversation.updateOne(
                { _id: req.body.messId },
                {
                    $pull: {
                        member: req.userId,
                    },
                },
            );
            res.status(200).json({ successful: true });
        } catch (error) {
            res.status(500).json({ successful: false });
        }
    }

    async getConversationForSugestion(req, res) {
        try {
            const now = new Date();
            const timeActive = new Date(now.getFullYear(), now.getMonth(), now.getDate() - +req.query.timeActive);
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
            res.status(500).json({ successful: false });
        }
    }
}

module.exports = new ConversationController();
