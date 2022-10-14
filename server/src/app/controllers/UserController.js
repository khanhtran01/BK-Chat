const Account = require('../models/Account');
const Conversation = require('../models/Conversation');
const verifyToken = require('../../util/verifyToken');
const Chat = require('../models/Chat');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ConversationController = require('./ConversationController');
const saltRounds = 10;
class UserController {
    async home(req, res, next) {
        try {
            var userInfor = await Account.findOne({ _id: req.userId }, { password: 0 })
            var conversations = await Conversation
                .find({ 'member': req.userId })
                .populate('member', { password: 0 }) // note
                .sort({ 'updatedAt': -1 });
            // count number of chats un read in conversation
            conversations = mutipleMongooseToObject(conversations)
            for (var conversation of conversations) {
                conversation.numUnRead = await Chat
                    .find({ conversationId: conversation._id, userRead: { $nin: req.userId } })
                    .count()
                conversation.lastChat = await Chat
                    .findOne({ conversationId: conversation._id }, { content: 1 })
                    .sort({ 'createdAt': -1 });
            }
            res.status(200).json({
                "userInfor": userInfor,
                "conversations": conversations,
                successful: true
            })
        } catch (error) {
            res.status(500).json({ successful: false })
        }
    }
    async checkLogin(req, res, next) {
        try {
            const account = await Account.findOne({ email: req.body.email })
            if (account) {
                bcrypt.compare(req.body.password, account.password, function (err, result) {
                    if (result) {
                        var token = jwt.sign({ _id: account._id }, process.env.JWT_SECRECT, { expiresIn: "8h" });
                        res.status(200).json({ token: token, successful: true });
                    } else {
                        res.status(200).json({ message: "Invalid email or password", successful: false });
                    }
                });
            } else {
                res.status(200).json({ message: "Invalid email or password", successful: false });
            }
        } catch (error) {
            res.status(500).json({ successful: false })
        }
    }
    async storeAccount(req, res, next) {
        try {
            const account = await Account.find({
                email: req.body.email
            });
            if (account.length > 0) {
                res.status(200).json({ message: "Email is exit", successful: false })
            } else {
                bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                    await Account.create({
                        email: req.body.email,
                        password: hash,
                        username: req.body.username,
                        avatar: 'https://res.cloudinary.com/be-dev/image/upload/v1646538111/uploads/edmtkrzhgjyypakze2bp.jpg',
                        address: '',
                        desc: '',
                    })
                });
                res.status(200).json({ message: "Register Successfull", successful: true })
            }
        } catch (error) {
            res.status(500).json({ successful: false })
        }
    }
    logout(req, res, next) {
        res.status(200).json({ message: "Logout", successful: true });
    }

    async checkToken(req, res, next) {
        try {
            var token = req.header("Authorization").split(" ")[1]
            verifyToken(token);
            res.status(200).json({ message: "Successful", successful: true })
        } catch (error) {
            res.status(401).json({ message: "Token is not valid", successful: false })
        }
    }

    async seachUser(req, res, next) {
        try {
            const user = await Account.findOne({ email: req.query.email }, { password: 0, address: 0, desc: 0 });
            if (user && user._id != req.userId) {
                console.log(user._id, req.userId);
                const result = await Conversation.findOne({
                    type: 'single',
                    member: {
                        $all: [req.userId, user._id]
                    }
                })
                if (result) {
                    res.status(200).json({ isContacted: 1, user: user, successful: true })
                } else {
                    res.status(200).json({ isContacted: 0, user: user, successful: true })
                }
            } else if (user) {
                res.status(200).json({ message: "Can't not add yourself", successful: false })
            } else {
                res.status(200).json({ message: "User not found", successful: false })
            }
        } catch (error) {
            res.status(500).json({ successful: false })
        }
    }
    // async personalInfo(req, res, next) {
    //     try {
    //         const user_id = req.query.id;
    //         const user = await Account.findOne({ _id: user_id })
    //         res.send(user);
    //     } catch (error) {
    //         next(error)
    //     }
    // }
}

module.exports = new UserController();
