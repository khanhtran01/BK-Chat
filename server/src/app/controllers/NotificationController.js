const Notification = require('../models/Notification');
const Conversation = require('../models/Conversation');
const Chat = require('../models/Chat');
class NotificationController {
    async new(req, res) {
        try {
            const members = req.body.members.map((e) => {
                return {
                    userId: e,
                };
            });
            await Notification.create({
                conversationId: req.body.conversationId,
                member: members,
            });
            res.status(200).json({ successful: true });
        } catch (error) {
            res.status(500).json({ successful: false });
        }
    }

    async getAll(req, res) {
        try {
            const notifications = await Notification.find({
                'member.userId': req.userId,
            })
                .populate('member.userId', { password: 0, address: 0, desc: 0 })
                .populate('conversationId', { member: 0, desc: 0, createdAt: 0, updatedAt: 0 });
            res.status(200).json({ notifications, successful: true });
        } catch (error) {
            res.status(500).json({ successful: false });
        }
    }

    async action(req, res) {
        try {
            const notificationId = req.body.notifyId;
            await Notification.updateOne(
                { _id: notificationId, 'member.userId': req.userId },
                {
                    $set: { 'member.$.status': req.body.status },
                },
            );
            if (req.body.status == 'reject') {
                await Notification.updateOne({
                    _id: notificationId,
                    status: 'reject',
                });
            } else {
                const notification = await Notification.findOne({ _id: notificationId, status: 'pending' });
                let members = [];
                let flag = true;
                for (let i = 0; i < notification.member.length; i++) {
                    if (notification.member[i].status == 'pending') {
                        flag = false;
                    }
                    members.push(notification.member[i].userId);
                }
                if (flag && members.length > 2) {
                    const conversation = await Conversation.create({
                        name: 'Sub group of ..',
                        type: 'group',
                        member: members,
                    });
                    await Chat.create({
                        conversationId: conversation._id,
                        userId: req.userId,
                        content: 'Hi',
                        type: 'text',
                        userRead: [req.userId],
                        replyFrom: null,
                    });
                    await Notification.updateOne({
                        _id: notificationId,
                        status: 'accept',
                    });
                }
            }
            res.status(200).json({ successful: true });
        } catch (error) {
            res.status(500).json({ successful: false });
        }
    }
}

module.exports = new NotificationController();
