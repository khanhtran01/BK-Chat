const fs = require('fs');
const mongoose = require('mongoose');
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const User = require('../../models/User');
const Chat = require('../../models/Chat');
const Conversation = require('../../models/Conversation');
const PushDataSub = async (conversationId, conversationName, file, numChat) => {
    const password =
        '$2b$10$FzU29JF7cNwHL9gmj/xp6uE3KThoJET3dVGPP689CA8k6DADj3CHC';
    const now = new Date();
    const conversation = await Conversation.findOne({ _id: conversationId });
    var oldMembers = [];
    if (conversation) {
        var obj = await Conversation.findOne(
            { _id: conversationId },
            { member: 1 }
        );
        oldMembers = obj.member;
    }
    fs.readFile(`./dataset/${file}`, 'utf8', async (err, jsonString) => {
        if (err) {
            console.log('File read failed:', err);
            process.exit(1);
        }
        const data = JSON.parse(jsonString);
        if (!conversation) {
            let arrChat = [];
            let arrUser = [];
            let arrUserID = [];
            for (var i = 0; i < data.length; i++) {
                if (i < numChat) {
                    const newTime = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        now.getHours(),
                        now.getMinutes() - (numChat - i) * 10,
                        now.getSeconds()
                    );
                    arrChat.push({
                        _id: mongoose.Types.ObjectId(data[i].id),
                        conversationId: conversationId,
                        userId: mongoose.Types.ObjectId(data[i].userId),
                        content: data[i].content,
                        type: 'text',
                        replyFrom: null,
                        createdAt: newTime,
                    });

                    if (!arrUserID.find((userId) => userId == data[i].userId)) {
                        const randomName = uniqueNamesGenerator({
                            dictionaries: [names, names],
                            length: 2,
                            separator: ' ',
                        });
                        arrUserID.push(data[i].userId);
                        arrUser.push({
                            _id: mongoose.Types.ObjectId(data[i].userId),
                            email: `${data[i].userId}@gmail.com`,
                            password: password,
                            username: randomName,
                            verify: true,
                            desc: 'User from dataset',
                        });

                        oldMembers.push(
                            mongoose.Types.ObjectId(data[i].userId)
                        );
                    }
                } else {
                    await Chat.insertMany(arrChat);
                    await User.insertMany(arrUser);
                    const firstChat = arrChat[0];
                    await Conversation.create({
                        _id: conversationId,
                        name: conversationName,
                        member: oldMembers,
                        type: 'group',
                        createdAt: firstChat.createdAt,
                    });
                    break;
                }
            }
        } else {
            const lastChat = await Chat.findOne({
                conversationId: conversationId,
            }).sort({ createdAt: -1 });
            var flag = false;
            var count = 0;
            for (var i = 0; i < data.length; i++) {
                if (lastChat._id.equals(mongoose.Types.ObjectId(data[i].id))) {
                    flag = true;
                    continue;
                }
                if (flag) {
                    count++;
                    if (count > numChat) {
                        await Conversation.updateOne(
                            { _id: conversationId },
                            {
                                member: oldMembers,
                                countForSuggestion: numChat,
                                // updatedAt note cai nay
                            }
                        );
                        console.log(count);
                        break;
                    }
                    const newTime = new Date(
                        lastChat.createdAt.getFullYear(),
                        lastChat.createdAt.getMonth(),
                        lastChat.createdAt.getDate(),
                        lastChat.createdAt.getHours(),
                        lastChat.createdAt.getMinutes(),
                        lastChat.createdAt.getSeconds() + count * 10
                    );
                    await Chat.create({
                        _id: mongoose.Types.ObjectId(data[i].id),
                        conversationId: conversationId,
                        userId: mongoose.Types.ObjectId(data[i].userId),
                        content: data[i].content,
                        type: 'text',
                        replyFrom: null,
                        createdAt: newTime,
                    });
                    const user = await User.findOne({
                        _id: mongoose.Types.ObjectId(data[i].userId),
                    });
                    if (!user) {
                        const randomName = uniqueNamesGenerator({
                            dictionaries: [names, names],
                            length: 2,
                            separator: ' ',
                        });
                        await User.create({
                            _id: mongoose.Types.ObjectId(data[i].userId),
                            email: `${data[i].userId}@gmail.com`,
                            password: password,
                            username: randomName,
                            verify: true,
                            desc: 'User from dataset',
                        });
                        oldMembers.push(
                            mongoose.Types.ObjectId(data[i].userId)
                        );
                    } else {
                        if (!oldMembers.includes(user._id)) {
                            oldMembers.push(user._id);
                        }
                    }
                }
            }
        }
        console.log('Done!!');
        process.exit(0);
    });
};

module.exports = PushDataSub;
