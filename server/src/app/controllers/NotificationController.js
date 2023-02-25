const Notification = require('../models/Notification');
const Conversation = require('../models/Conversation');
const Chat = require('../models/Chat');
const userDTOMini = {
    _id: 1,
    email: 1,
    username: 1,
    avatar: 1,
};
class NotificationController {
    async new(req, res, next) {
        try {
            const data = JSON.parse(req.body.data);
            for (let value in data) {
                let information = data[value];
                const members = information.userList.map((member) => {
                    return {
                        userId: member,
                    };
                });
                await Notification.create({
                    conversationId: req.body.conversationId,
                    member: members,
                    topic: information.name
                });
            }
            res.status(200).json({ successful: true });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const notifications = await Notification.find({
                'member.userId': req.userId,
            })
                .populate('member.userId', userDTOMini)
                .populate('conversationId', { _id: 1, name: 1, avatar: 1 });
            res.status(200).json({ notifications, successful: true });
        } catch (error) {
            next(error);
        }
    }

    async action(req, res, next) {
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
            next(error);
        }
    }
}

module.exports = new NotificationController();
