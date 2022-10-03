const Account = require('../models/Account');
const Conversation = require('../models/Conversation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
class UserController {
    async index(req, res, next) {
        try {
            var userInfo = await Account.findOne({ _id: req.userId })
            var conversations = await Conversation
                .find({ 'member': req.userId})
                .populate('member')
                .sort({ 'updatedAt': -1 });
            res.status(200).json({"userInfor": userInfo, "conversations": conversations})
        } catch (error) {
            next(error);
        }
    }
    async checkLogin(req, res, next) {
        try {
            const account = await Account.findOne({ email: req.body.email })
            if (account) {
                bcrypt.compare(req.body.password, account.password, function (err, result) {
                    if (result) {
                        var token = jwt.sign({ _id: account._id }, process.env.JWT_SECRECT);
                        res.cookie('token', token, {
                            signed: true,
                            expires: new Date(Date.now() + 8 * 3600000)
                        });
                        res.status(200).json(account);
                    } else {
                        res.status(400).json({ "message": "Invalid username or password" });
                    }
                });
            } else {
                res.status(400).json({ "message": "Invalid username or password" });
            }
        } catch (error) {
            next(error);
        }
    }
    async storeAccount(req, res, next) {
        try {
            const account = await Account.find({
                email: req.body.email
            });
            if (account.length > 0) {
                res.status(401).json({ message: "Username or Email is exit" })
            } else {
                req.body.address = '';
                req.body.desc = '';
                req.body.avatar = '/img/avatar-default.png';
                bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                    req.body.password = hash;
                    const _account = await new Account(req.body);
                    await _account.save();
                });
                res.status(200).json({ message: "Register Successfull" })
            }
        } catch (error) {
            next(error);
        }
    }
    logout(req, res, next) {
        res.clearCookie('token');
        res.status(200).json({ "message": "Logout" });
    }
}

module.exports = new UserController();
