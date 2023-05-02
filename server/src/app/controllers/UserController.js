const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Chat = require('../models/Chat');
const { redis } = require('../../config/redis');
const resizingImg = require('../../util/resizingImg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userDTOMini = {
    _id: 1,
    email: 1,
    username: 1,
    avatar: 1,
};
const userDTO = {
    _id: 1,
    email: 1,
    username: 1,
    avatar: 1,
    address: 1,
    desc: 1,
};
class UserController {
    async home(req, res, next) {
        try {
            let conversations = await Conversation.find({
                member: req.userId,
                $expr: { $gte: [{ $size: '$member' }, 2] },
            }).sort({ updatedAt: -1 });
            let allContact = [];
            for (let i = 0; i < conversations.length; i++) {
                conversations[i] = conversations[i].toObject();
                if (conversations[i].type == 'single') {
                    let user_0 = (
                        await User.findOne({ _id: conversations[i].member[0] }, userDTOMini)
                    ).toObject();
                    let user_1 = (
                        await User.findOne({ _id: conversations[i].member[1] }, userDTOMini)
                    ).toObject();
                    if (conversations[i].member[0] != req.userId) {
                        allContact.push({
                            type: conversations[i].type,
                            userId: conversations[i].member[0],
                            username: user_0.username,
                            avatar: user_0.avatar,
                        });
                    } else {
                        allContact.push({
                            type: conversations[i].type,
                            userId: conversations[i].member[1],
                            username: user_1.username,
                            avatar: user_1.avatar,
                        });
                    }
                    user_0.avatar = resizingImg(user_0.avatar);
                    user_1.avatar = resizingImg(user_1.avatar);
                    conversations[i].member = [user_0, user_1];
                } else {
                    conversations[i].member = [];
                    conversations[i].avatar = resizingImg(conversations[i].avatar);
                    allContact.push({
                        type: conversations[i].type,
                        conversationId: conversations[i]._id,
                        groupName: conversations[i].name,
                        avatar: conversations[i].avatar,
                    });
                }
                const chats = await Chat.find(
                    { conversationId: conversations[i]._id },
                    { content: 1, createdAt: 1, userRead: 1 },
                )
                    .limit(10)
                    .sort({ createdAt: -1 });
                let numUnRead = chats.filter((e) => !e.userRead.includes(req.userId)).length;
                conversations[i].numUnRead = numUnRead < 10 ? numUnRead : 10;
                conversations[i].lastChat = {
                    _id: chats[0]._id,
                    content: chats[0].content,
                    createdAt: chats[0].createdAt,
                };
            }
            res.status(200).json({
                conversations: conversations,
                allContact: allContact,
                successful: true,
            });
        } catch (error) {
            next(error);
        }
    }
    async seachUser(req, res, next) {
        try {
            const user = await User.findOne({ email: req.query.email }, userDTOMini);
            if (user && user._id != req.userId) {
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
            next(error);
        }
    }
    async findUserByEmail(email) {
        try {
            return await User.findOne({ email: email }, userDTOMini);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async personalInfo(req, res, next) {
        try {
            const userInfor = await User.findOne({ _id: req.userId }, userDTO);
            res.status(200).json({ userInfor: userInfor, successful: true });
        } catch (error) {
            next(error);
        }
    }
    async changePassword(req, res, next) {
        try {
            bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                await User.updateOne({ _id: req.userId }, { password: hash });
            });
            res.status(200).json({ successful: true });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
