const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Chat = require('../models/Chat');
const { mutipleMongooseToObject } = require('../../util/mongoose');
class UserController {
    async home(req, res) {
        try {
            let conversations = await Conversation.find({ member: req.userId })
                // .populate('member', { password: 0, address: 0, desc: 0 }) // note
                .sort({ updatedAt: -1 });
            conversations = mutipleMongooseToObject(conversations);
            let allContact = [];
            for (let i = 0; i < conversations.length; i++) {
                if (conversations[i].type == 'single') {
                    let user_0 = await User.findOne(
                        { _id: conversations[i].member[0] },
                        { password: 0, address: 0, desc: 0 },
                    );
                    let user_1 = await User.findOne(
                        { _id: conversations[i].member[1] },
                        { password: 0, address: 0, desc: 0 },
                    );
                    if (conversations[i].member[0] != req.userId) {
                        allContact.push({
                            type: conversations[i].type,
                            userId: conversations[i].member[0],
                            username: user_0.username,
                        });
                    } else {
                        allContact.push({
                            type: conversations[i].type,
                            userId: conversations[i].member[1],
                            username: user_1.username,
                        });
                    }
                    conversations[i].member = [user_0, user_1];
                } else {
                    allContact.push({
                        type: conversations[i].type,
                        conversationId: conversations[i]._id,
                        groupName: conversations[i].name,
                        avatar: conversations[i].avatar,
                    });
                }
                conversations[i].numUnRead = await Chat.find({
                    conversationId: conversations[i]._id,
                    userRead: { $nin: req.userId },
                }).count();
                conversations[i].lastChat = await Chat.findOne(
                    { conversationId: conversations[i]._id },
                    { content: 1, createdAt: 1 },
                ).sort({ createdAt: -1 });
            }
            res.status(200).json({
                conversations: conversations,
                allContact: allContact,
                successful: true,
            });
        } catch (error) {
            res.status(500).json({ successful: false });
        }
    }
    async seachUser(req, res) {
        try {
            const user = await User.findOne({ email: req.query.email }, { password: 0, address: 0, desc: 0 });
            if (user && user._id != req.userId) {
                console.log(user._id, req.userId);
                const result = await Conversation.findOne({
                    type: 'single',
                    member: {
                        $all: [req.userId, user._id],
                    },
                });
                if (result) {
                    res.status(200).json({ isContacted: 1, user: user, successful: true });
                } else {
                    res.status(200).json({ isContacted: 0, user: user, successful: true });
                }
            } else if (user) {
                res.status(200).json({ message: "Can't not add yourself", successful: false });
            } else {
                res.status(200).json({ message: 'User not found', successful: false });
            }
        } catch (error) {
            res.status(500).json({ successful: false });
        }
    }
    async personalInfo(req, res) {
        try {
            const userInfor = await User.findOne({ _id: req.userId }, { password: 0 });
            res.status(200).json({ userInfor: userInfor, successful: true });
        } catch (error) {
            res.status(500).json({ successful: false });
        }
    }
}

module.exports = new UserController();
