const Account = require("../../models/Account");
const Chat = require('../../models/Chat')
const Conversation = require("../../models/Conversation");

const CleanData = async (conversationId) => {
    await Chat.deleteMany({ conversationId: conversationId });
    const conversation = await Conversation.findOne({ _id: conversationId }, { member: 1 })
    for (var i = 0; i < conversation.member.length; i++) {
        await Account.deleteMany({
            _id: conversation.member[i]
        });
    }
    await Conversation.deleteOne({ _id: conversationId });
    console.log('Done');
    process.exit(0);
}

module.exports = CleanData;