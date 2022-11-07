const fs = require('fs')
const mongoose = require('mongoose');
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const sleep = require('./sleep');
const generatorTime = require('./time')
const Account = require("../../models/Account");
const Chat = require('../../models/Chat')
const Conversation = require("../../models/Conversation");
const GeneratorData = async (step, number) => {
    const conversationId = mongoose.Types.ObjectId('6344e91b89558fb2b5ec1234');
    const nameConversation = "Group Bitrex"
    const start = step * number - number;
    const end = step * number - 1;
    fs.readFile("./data.json", "utf8", async (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            process.exit(1)
        }
        data = JSON.parse(jsonString)
        for (var i = start; i <= end; i++) {
            const index = i - start;
            await Chat.create({
                _id: mongoose.Types.ObjectId(data[i].id),
                conversationId: conversationId,
                userId: mongoose.Types.ObjectId(data[i].from_id),
                content: data[i].message,
                type: 'text',
                replyFrom: data[i].reply_to ? mongoose.Types.ObjectId(data[i].reply_to) : data[i].reply_to,
                createdAt: generatorTime(index)
            })
            const user = await Account.findOne({ _id: mongoose.Types.ObjectId(data[i].from_id) })
            if (!user) {
                const randomName = uniqueNamesGenerator({ dictionaries: [names, names], length: 2, separator: ' ' });
                await Account.create({
                    _id: mongoose.Types.ObjectId(data[i].from_id),
                    email: `${data[i].from_id}@gmail.com`,
                    password: "$2b$10$FzU29JF7cNwHL9gmj/xp6uE3KThoJET3dVGPP689CA8k6DADj3CHC",
                    username: randomName,
                    avatar: 'https://res.cloudinary.com/be-dev/image/upload/v1667490386/uploads/avatar-default_ampzcl.png',
                    address: '',
                    desc: 'Account from dataset'
                })
            }
            sleep(100)
        }
        const conversation = await Conversation.findOne({ _id: conversationId })
        const members = await Account.find({}, { _id: 1 })
        const result = members.map((member) => member._id)
        if (!conversation) {
            await Conversation.create({
                _id: conversationId,
                name: nameConversation,
                member: result,
                createdAt: generatorTime(end)
            })
        } else {
            await Conversation.updateOne({ _id: conversationId }, {
                member: result,
                updatedAt: generatorTime(end)
            })
        }
        console.log("Done!!");
        process.exit(0);
    });
}

module.exports = GeneratorData