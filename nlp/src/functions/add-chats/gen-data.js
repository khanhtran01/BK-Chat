const fs = require('fs')
const mongoose = require('mongoose');
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const { generatorTime, randomTime } = require('./time')
const Account = require("../../models/Account");
const Chat = require('../../models/Chat')
const Conversation = require("../../models/Conversation");
const GeneratorData = async (step, number, maxHours) => {
    const conversationId = mongoose.Types.ObjectId('6344e91b89558fb2b5ec1234');
    const nameConversation = 'Group Bitrex';
    const password = '$2b$10$FzU29JF7cNwHL9gmj/xp6uE3KThoJET3dVGPP689CA8k6DADj3CHC';
    // Order of chats to add to database
    const start = step * number - number;
    const end = step * number - 1;
    // Array random time with number of chats added and max hours 
    const indexs = randomTime(number, maxHours)
    // Old member in conversation
    const conversation = await Conversation.findOne({ _id: conversationId })
    var oldMembers = []
    if (conversation) {
        var obj = await Conversation.findOne({ _id: conversationId }, { member: 1 })
        oldMembers = obj.member;
    }
    fs.readFile("./data.json", "utf8", async (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            process.exit(1)
        }
        var data = JSON.parse(jsonString)
        for (var i = start; i <= end; i++) {
            const index = i - start;
            await Chat.create({
                _id: mongoose.Types.ObjectId(data[i].id),
                conversationId: conversationId,
                userId: mongoose.Types.ObjectId(data[i].from_id),
                content: data[i].message,
                type: 'text',
                replyFrom: data[i].reply_to ? mongoose.Types.ObjectId(data[i].reply_to) : data[i].reply_to,
                createdAt: generatorTime(indexs[index])
            })
            const user = await Account.findOne({ _id: mongoose.Types.ObjectId(data[i].from_id) })
            if (!user) {
                const randomName = uniqueNamesGenerator({
                    dictionaries: [names, names], length: 2, separator: ' '
                });
                await Account.create({
                    _id: mongoose.Types.ObjectId(data[i].from_id),
                    email: `${data[i].from_id}@gmail.com`,
                    password: password,
                    username: randomName,
                    avatar: '',
                    address: '',
                    desc: 'Account from dataset'
                })
                oldMembers.push(mongoose.Types.ObjectId(data[i].from_id))
            } else {
                if(!oldMembers.includes(user._id)){
                    oldMembers.push(user._id)
                }
            }
        }
        if (!conversation) {
            await Conversation.create({
                _id: conversationId,
                name: nameConversation,
                member: oldMembers,
                type: 'group',
                createdAt: generatorTime(indexs[end - start]),
                updatedAt: generatorTime(indexs[end - start])
            })
        } else {
            await Conversation.updateOne({ _id: conversationId }, {
                member: oldMembers,
                createdAt: generatorTime(indexs[end - start]),
                updatedAt: generatorTime(indexs[end - start])
            })
        }
        console.log("Done!!");
        process.exit(0);
    });
}

module.exports = GeneratorData