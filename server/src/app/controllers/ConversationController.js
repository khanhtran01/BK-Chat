const Conversation = require('../models/Conversation');
const Account = require('../models/Account');
const Chat = require('../models/Chat');
const ChatController = require('./ChatController');
class ConversationController {
    async getAllMessage(req, res, next) {
        try {
            var messages = await Message
                .find({ 'member': req.userId })
                .populate('member')
                .sort({ 'updatedAt': -1 });
            messages = mutipleMongooseToObject(messages)
            for (var mess of messages) {
                mess.numUnRead = await Chat
                    .find({ messageId: mess._id, user_read: { $nin: req.userId } })
                    .count()
            }
            return messages;
        } catch (error) {
            next(error)
        }
    }
    async newMessage(req, res, next) {
        try {
            const user = await Account
                .findOne({ email: req.body.email });
            if (user) {
                const conversation = await Conversation
                    .create({
                        name: 'Name conversation',
                        type: 'single',
                        member: [req.userId, user._id]
                    });
                await Chat
                    .create({
                        conversationId: conversation._id,
                        user_id: req.userId,
                        content: req.body.chat,
                        type: 'text',
                        user_read: [req.userId]
                    })
                res.status(200).json({ message: "New contact successful" })
            } else {
                res.status(404).json({ message: "Email not found" })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async newGroupMessage(req, res, next) {
        try {
            var member = req.body.list_ids_group;
            var newMember = [];
            newMember.push(req.userId);
            member.forEach(e => {
                newMember.push(e);
            })
            await Message.create({
                name: req.body.group_name,
                type: 'group',
                member: newMember,
                desc: req.body.group_desc,
                avatar: 'None',
            })
            const newMess = await Message
                .find({}).populate('member').sort({ 'updatedAt': -1 }).limit(1)
            res.send(newMess[0])
        } catch (error) {
            next(error)
        }
    }
    async getMessage(req, res, next) {
        try {
            const conversationId = req.query.id;
            // make sure user is in this conversation 
            const conversation = await Conversation
                .findOne({ _id: conversationId, 'member': req.userId })
            // .populate('member');
            if (conversation) {
                await Chat
                    .updateMany({ conversationId: conversationId }, {
                        $addToSet: {
                            user_read: req.userId
                        },
                    })
                var chats = await ChatController.pagingChat(conversationId, 8, 1);
                res.status(200).json({ chats: chats })
            } else {
                res.status(404).json({ message: "User is not in that conversation" })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async pagingChat(req, res, next) {
        try {
            const chats = await ChatController.pagingChat(req.query.messId, 8, req.query.page);
            res.send(chats);
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async getAllContact(req, res, next) {
        try {
            var listMessage = await Message
                .find({ 'member': req.userId })
            var allContact = [];
            listMessage.forEach(message => {
                if (message.type == 'single') {
                    message.member.forEach(memId => {
                        if (memId != req.userId) {
                            allContact.push({ type: message.type, userId: memId });
                        }
                    })
                } else {
                    var userIdsGroup = message.member.filter(memId => memId != req.userId)
                    allContact.push({ type: message.type, userIds: userIdsGroup, messageId: message._id })
                }
            })
            res.send(allContact);
        } catch (error) {
            next(error)
        }
    }
    async getAllContactSort(req, res, next) {
        try {
            var listMessage = await Message
                .find({ 'member': req.userId })
                .populate('member')
            var allContactName = [];
            var allContact = [];
            var result = [];
            listMessage.forEach(message => {
                if (message.type == 'single') {
                    message.member.forEach(mem => {
                        if (mem._id != req.userId) {
                            allContactName.push(mem.fullname);
                            allContact.push({ fullname: mem.fullname, id: mem._id });
                        }
                    })
                }
            })
            allContactName.sort();
            allContactName.forEach(e => {
                result.push(allContact.find(e1 => e1.fullname === e))
            })
            res.send(result);
        } catch (error) {
            next(error)
        }
    }
    async addMemberGroup(req, res, next) {
        try {
            if (typeof (req.body.list_member_add) == 'string') {
                req.body.list_member_add = [req.body.list_member_add]
            }
            await Message
                .updateOne({ _id: req.query.messId }, {
                    $addToSet: {
                        member: {
                            $each: req.body.list_member_add
                        }
                    }
                })
            res.redirect('back');
        } catch (error) {
            next(error)
        }
    }
    async outGroup(req, res, next) {
        try {
            await Message
                .updateOne({ _id: req.query.messId }, {
                    $pull: {
                        member: req.userId
                    }
                })
            res.redirect('/');
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ConversationController();
