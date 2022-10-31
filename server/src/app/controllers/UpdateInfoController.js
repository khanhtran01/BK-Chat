const Conversation = require('../models/Conversation');
const Account = require('../models/Account');
class UpdateInfoController {
    async personalInfo(req, res, next) {
        try {
            const id = req.userId;
            if (req.file) {
                req.body.avatar = req.file.path;
                await Account.updateOne({ _id: id }, {
                    username: req.body.username,
                    avatar: req.body.avatar,
                    desc: req.body.desc,
                    address: req.body.address
                })
                res.status(200).json({ message: "Update successful", successful: true })
            } else {
                await Account.updateOne({ _id: id }, {
                    username: req.body.username,
                    desc: req.body.desc,
                    address: req.body.address
                })
                res.status(200).json({ message: "Update successful", successful: true })
            }
        } catch (error) {
            res.status(500).json({ successful: false })
        }
    }
    async groupInfo(req, res, next) {
        try {
            const conversationId = req.body.conversationId
            if (req.file) {
                await Conversation.updateOne({ _id: conversationId }, {
                    name: req.body.groupName,
                    desc: req.body.groupDesc,
                    avatar: req.file.path
                })
            } else {
                await Conversation.updateOne({ _id: conversationId }, {
                    name: req.body.groupName,
                    desc: req.body.groupDesc,
                })
            }
            res.status(200).json({ successful: true })
        } catch (error) {
            res.status(500).json({ successful: false })
        }
    }
}

module.exports = new UpdateInfoController();
