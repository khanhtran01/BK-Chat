
const Notification = require('../models/Notification');
class NotificationController {
    async new(req, res, next) {
        try {
            const members = req.body.members.map(e => {
                return {
                    userId: e,
                }
            })
            await Notification.create({
                conversationId: req.body.conversationId,
                members,
            })
            res.status(200).json({ successful: true });
        } catch (error) {
            console.log("🚀 ~ error", error)
            res.status(500).json({ successful: false })
        }
    }

    async getAll(req, res, next) {
        try {
            const notifications = await Notification.find({
                'members.userId': req.userId
            }).populate('members.userId',{ password: 0, address: 0, desc: 0})
            res.status(200).json({ notifications, successful: true });
        } catch (error) {
            res.status(500).json({ successful: false })
        }
    }

    async accept(req, res, next) {
        try {
            const notificationId = req.body.notificationId;
            if (!req.body.isNewGroup) {
                await Notification.updateOne({ _id: notificationId, 'members.userId': req.userId }, {
                    $set: { 'members.$.accept': 'accept' }
                })
            } else {
                console.log('herr');
            }
            res.status(200).json({ successful: true });
        } catch (error) {
            res.status(500).json({ successful: false })
        }
    }
}

module.exports = new NotificationController();