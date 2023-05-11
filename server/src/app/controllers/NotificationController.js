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
            const notification = await Notification.findOne({
                _id: notificationId,
                status: 'pending',
            });
            if (!notification) {
                res.status(200).json({ successful: false, message: 'This suggestion is already done' });
                return;
            }
            await Notification.updateOne(
                { _id: notificationId, 'member.userId': req.userId },
                {
                    $set: { 'member.$.status': req.body.action },
                },
            );
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
                let conversation;
                const topicTemp = notification.topic;
                const topic = topicTemp.split('/').filter(Boolean).join(',');
                if (notification.type == 'group') {
                    const parentConversation = await Conversation.findOne(
                        { _id: req.body.conversationId },
                        { name: 1 },
                    );
                    conversation = await Conversation.create({
                        name: topic,
                        type: 'group',
                        member: members,
                        desc: 'Sub group of ' + parentConversation.name,
                    });
                    await Chat.create({
                        conversationId: conversation._id,
                        userId: members[members.length - 1],
                        content: 'This group is created automatically by the system.',
                        type: 'text',
                        userRead: [members[members.length - 1]],
                        replyFrom: null,
                    });
                } else {
                    conversation = await Conversation.create({
                        name: topic,
                        type: 'group',
                        member: members,
                        desc: 'Merged group same topic',
                    });
                    await Chat.create({
                        conversationId: conversation._id,
                        userId: members[members.length - 1],
                        content: 'This group is created automatically by the system.',
                        type: 'text',
                        userRead: [members[members.length - 1]],
                        replyFrom: null,
                    });
                }
                await Notification.updateOne(
                    {
                        _id: notificationId,
                    },
                    { status: 'accept' },
                );
                res.status(200).json({
                    successful: true,
                    message: 'Create group is successful',
                    conversation: conversation,
                    createGroup: true,
                });
            } else {
                res.status(200).json({ successful: true, message: 'Wait for voting', createGroup: false });
            }
        } catch (error) {
            next(error);
        }
    }

    async validateNotifications() {
        const now = new Date();
        const time = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const suggesstions = await Notification.find({
            status: 'pending',
            createdAt: {
                $lt: time,
            },
        });
        // console.log(suggesstions);
        for (const suggestion of suggesstions) {
            let membersForGroup = [];
            suggestion.member.forEach((e) => {
                if (e.status === 'accept') membersForGroup.push(e._id);
            });
            if (membersForGroup.length > 2) {
                const topicTemp = suggestion.topic;
                const topic = topicTemp.split('/').filter(Boolean).join(',');
                if (suggestion.type == 'group') {
                    const parentConversation = await Conversation.findOne(
                        { _id: suggestion.conversationId },
                        { name: 1 },
                    );
                    const conversation = await Conversation.create({
                        name: topic,
                        type: 'group',
                        member: membersForGroup,
                        desc: 'Sub group of ' + parentConversation.name,
                    });
                    await Chat.create({
                        conversationId: conversation._id,
                        userId: membersForGroup[membersForGroup.length - 1],
                        content: 'This group is created automatically by the system.',
                        type: 'text',
                        userRead: [membersForGroup[membersForGroup.length - 1]],
                        replyFrom: null,
                    });
                } else {
                    const conversation = await Conversation.create({
                        name: topic,
                        type: 'group',
                        member: membersForGroup,
                        desc: 'Merged group same topic',
                    });
                    await Chat.create({
                        conversationId: conversation._id,
                        userId: membersForGroup[membersForGroup.length - 1],
                        content: 'This group is created automatically by the system.',
                        type: 'text',
                        userRead: [membersForGroup[membersForGroup.length - 1]],
                        replyFrom: null,
                    });
                }
                await Notification.updateOne(
                    {
                        _id: suggestion._id,
                    },
                    { status: 'accept' },
                );
                console.log('🚀 ~ Accepted notificationId: ' + suggestion._id);
            } else {
                await Notification.updateOne(
                    {
                        _id: suggestion._id,
                    },
                    { status: 'reject' },
                );
                console.log('🚀 ~ Rejected notificationId: ' + suggestion._id);
            }
        }
    }
}

module.exports = new NotificationController();
