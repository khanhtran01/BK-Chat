const resizeCloudinaryUrl = require('../../util/resizeCloudinaryUrl');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
class UpdateInfoController {
    async personalInfo(req, res, next) {
        try {
            const id = req.userId;
            console.log(req.file);
            if (req.file) {
                await User.updateOne(
                    { _id: id },
                    {
                        username: req.body.username,
                        avatar: resizeCloudinaryUrl(req.file.path),
                        desc: req.body.desc,
                        address: req.body.address,
                    },
                );
                res.status(200).json({ message: 'Update successful', successful: true });
            } else {
                await User.updateOne(
                    { _id: id },
                    {
                        username: req.body.username,
                        desc: req.body.desc,
                        address: req.body.address,
                    },
                );
                res.status(200).json({ message: 'Update successful', successful: true });
            }
        } catch (error) {
            next(error);
        }
    }
    async groupInfo(req, res, next) {
        try {
            const conversationId = req.body.conversationId;
            if (req.file) {
                await Conversation.updateOne(
                    { _id: conversationId },
                    {
                        name: req.body.groupName,
                        desc: req.body.groupDesc,
                        avatar: resizeCloudinaryUrl(req.file.path),
                    },
                );
            } else {
                await Conversation.updateOne(
                    { _id: conversationId },
                    {
                        name: req.body.groupName,
                        desc: req.body.groupDesc,
                    },
                );
            }
            res.status(200).json({ successful: true, message: 'Update successful' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UpdateInfoController();
