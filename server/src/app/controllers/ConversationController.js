const Conversation = require('../models/Conversation');
const Account = require('../models/Account');
const Chat = require('../models/Chat');
const ChatController = require('./ChatController');
class ConversationController {
    async newMessage(req, res, next) {
        try {
            const user = await Account
                .findOne({ email: req.body.email });
            if (user._id != req.userId) {
                const conversation = await Conversation
                    .create({
                        name: 'Name conversation',
                        type: 'single',
                        member: [req.userId, user._id]
                    });
                await Chat
                    .create({
                        conversationId: conversation._id,
                        userId: req.userId,
                        content: req.body.chat,
                        type: 'text',
                        userRead: [req.userId]
                    })
                res.status(200).json({ message: "New contact successful", successful: true })
            } else {
                res.status(404).json({ message: "Email not found", successful: false })
            }
        } catch (error) {
            res.status(500).json({ successful: false })
        }
    }
    // async newGroupMessage(req, res, next) {
    //     try {
    //         var member = req.body.list_ids_group;
    //         var newMember = [];
    //         newMember.push(req.userId);
    //         member.forEach(e => {
    //             newMember.push(e);
    //         })
    //         await Message.create({
    //             name: req.body.group_name,
    //             type: 'group',
    //             member: newMember,
    //             desc: req.body.group_desc,
    //             avatar: 'None',
    //         })
    //         const newMess = await Message
    //             .find({}).populate('member').sort({ 'updatedAt': -1 }).limit(1)
    //         res.send(newMess[0])
    //     } catch (error) {
    //         next(error)
    //     }
    // }
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
                            userRead: req.userId
                        },
                    })
                var chats = await ChatController.pagingChat(conversationId, 8, 1);
                res.status(200).json({ chats: chats, successful: true });
            } else {
                res.status(404).json({ message: "User is not in that conversation", successful: false });
            }
        } catch (error) {
            res.status(500).json({ successful: false })
        }
    }
    async pagingChat(req, res, next) {
        try {
            const chats = await ChatController.pagingChat(req.query.conversationId, 8, req.query.page);
            res.status(200).json({ chats: chats, successful: true });
        } catch (error) {
            res.status(500).json({ successful: false })
        }
    }
    async getAllContact(req, res, next) {
        try {
            var listConversation = await Conversation
                .find({ 'member': req.userId, type: 'single' })
            var allContact = [];
            listConversation.forEach(conversation => {
                if (conversation.member[0] != req.userId) {
                    allContact.push(conversation.member[0]);
                } else {
                    allContact.push(conversation.member[1]);
                }
            })
            res.status(200).json({ allContact: allContact, successful: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ successful: false })
        }
    }
    async getAllContactSort(req, res, next) {
        try {
            var listConversation = await Conversation
                .find({ 'member': req.userId, type: 'single' })
                .populate('member', { password: 0, address: 0, desc: 0 })
            var allContactName = [];
            var allContact = [];
            var result = [];
            listConversation.forEach(conversation => {
                if (conversation.member[0]._id == req.userId) {
                    allContactName.push(conversation.member[1].username);
                    allContact.push({
                        username: conversation.member[1].username,
                        conversationId: conversation._id,
                        avatar: conversation.member[1].avatar
                    });
                } else {
                    allContactName.push(conversation.member[0].username);
                    allContact.push({
                        username: conversation.member[0].username,
                        conversationId: conversation._id,
                        avatar: conversation.member[0].avatar
                    });
                }
            })
            allContactName.sort();
            allContactName.forEach(e => {
                result.push(allContact.find(e1 => e1.username === e))
            })
            res.status(200).json({ allContactSort: result, successful: true });
        } catch (error) {
            // console.log(error);
            res.status(500).json({ successful: false })
        }
    }
    // async addMemberGroup(req, res, next) {
    //     try {
    //         if (typeof (req.body.list_member_add) == 'string') {
    //             req.body.list_member_add = [req.body.list_member_add]
    //         }
    //         await Message
    //             .updateOne({ _id: req.query.messId }, {
    //                 $addToSet: {
    //                     member: {
    //                         $each: req.body.list_member_add
    //                     }
    //                 }
    //             })
    //         res.redirect('back');
    //     } catch (error) {
    //         next(error)
    //     }
    // }
    // async outGroup(req, res, next) {
    //     try {
    //         await Message
    //             .updateOne({ _id: req.query.messId }, {
    //                 $pull: {
    //                     member: req.userId
    //                 }
    //             })
    //         res.redirect('/');
    //     } catch (error) {
    //         next(error)
    //     }
    // }
}

module.exports = new ConversationController();
