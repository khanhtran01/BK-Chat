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
                    topic: information.name,
                    confidence: information.confidence,
                });
            }
            res.status(200).json({ successful: true });
        } catch (error) {
            next(error);
        }
    }

    async newSingle(req, res, next) {
        try {
            const groups = req.body.groups;
            const topics = req.body.topics;
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].length <= 2) continue;
                const members = groups[i].map((member) => {
                    return {
                        userId: member,
                    };
                });
                await Notification.create({
                    conversationId: '',
                    member: members,
                    topic: topics[i],
                    type: 'single',
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
                .populate('conversationId', { _id: 1, name: 1, avatar: 1 })
                .sort({ createdAt: -1 });
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
                    $set: { 'member.$.status': req.body.action },
                },
            );
            const notification = await Notification.findOne({ _id: notificationId, status: 'pending' });
            if (!notification) {
                res.status(200).json({ successful: false, message: 'This recommendation is already done.' });
                return;
            }
            let members = [];
            let flag = true;
            for (let i = 0; i < notification.member.length; i++) {
                if (notification.member[i].status == 'pending') {
                    flag = false;
                    break;
                } else if (notification.member[i].status == 'accept') {
                    members.push(notification.member[i].userId);
                }
            }
            if (flag) {
                const parentConversation = await Conversation.findOne({ _id: req.body.conversationId });
                const conversation = await Conversation.create({
                    name: 'Sub group of ' + parentConversation.name,
                    type: 'group',
                    member: members,
                });
                await Chat.create({
                    conversationId: conversation._id,
                    userId: members[members.length - 1],
                    content: 'Hi',
                    type: 'text',
                    userRead: [members[members.length - 1]],
                    replyFrom: null,
                });
                await Notification.updateOne(
                    {
                        _id: notificationId,
                    },
                    { status: 'accept' },
                );
                res.status(200).json({ successful: true, message: 'Create group is successful' });
            } else {
                res.status(200).json({ successful: true, message: 'Wait for voting' });
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new NotificationController();
