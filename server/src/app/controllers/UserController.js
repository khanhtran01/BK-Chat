const Account = require('../models/Account');
const Conversation = require('../models/Conversation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
class UserController {
    async index(req, res, next) {
        try {
            var userInfo = await Account.findOne({ _id: req.userId }, { password: -1 })
            var conversations = await Conversation
                .find({ 'member': req.userId })
                .populate('member')
                .sort({ 'updatedAt': -1 });
            // count number of chats un read in conversation
            conversations = mutipleMongooseToObject(conversations)
            for (var conversation of conversations) {
                conversation.numUnRead = await Chat
                    .find({ conversationId: conversation._id, user_read: { $nin: req.userId } })
                    .count()
            }
            res.status(200).json({ "userInfor": userInfo, "conversations": conversations })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async checkLogin(req, res, next) {
        try {
            const account = await Account.findOne({ email: req.body.email })
            if (account) {
                bcrypt.compare(req.body.password, account.password, function (err, result) {
                    if (result) {
                        var token = jwt.sign({ _id: account._id }, process.env.JWT_SECRECT, { expiresIn: "8h" });
                        res.status(200).json({ token: token, accessToken: "Successful" });
                    } else {
                        res.status(404).json({ message: "Invalid email or password" });
                    }
                });
            } else {
                res.status(404).json({ message: "Invalid email or password" });
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async storeAccount(req, res, next) {
        try {
            const account = await Account.find({
                email: req.body.email
            });
            if (account.length > 0) {
                res.status(404).json({ message: "Email is exit" })
            } else {
                req.body.address = '';
                req.body.desc = '';
                req.body.avatar = 'https://res.cloudinary.com/be-dev/image/upload/v1664804179/uploads/yc2grbnbd1kx5gy1mef7.jpg';
                bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                    req.body.password = hash;
                    const _account = await new Account(req.body);
                    await _account.save();
                });
                res.status(200).json({ message: "Register Successfull" })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
    logout(req, res, next) {
        res.status(200).json({ message: "Logout" });
    }

    verifyToken(res, req, next) {
        try {
            var token = req.header("Authorization").split(" ")[1]
            var checkToken = verifyToken(token);
            if (checkToken) {
                res.status(200).json({message: "Successfull"})
            } else {
                res.status(401).json({ message: "Token is not valid" })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = new UserController();
