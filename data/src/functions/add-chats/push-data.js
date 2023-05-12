const fs = require('fs');
const mongoose = require('mongoose');
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const User = require('../../models/User');
const Chat = require('../../models/Chat');
const Conversation = require('../../models/Conversation');
const PushData = async (
    timeToActivated,
    conversationId,
    conversationName,
    file
) => {
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
            process.exit(1);
        }
        const data = JSON.parse(jsonString);
        // First time add => add last timeToActivated days
        if (!conversation) {
            let arrChat = [];
            let arrUser = [];
            let arrUserID = [];
            const firstDay = new Date(data[0].created_At);
            // Date activated
            const dayActivated = new Date(
                firstDay.getFullYear(),
                firstDay.getMonth(),
                firstDay.getDate() + timeToActivated,
                firstDay.getHours(),
                firstDay.getMinutes()
            );
            for (var i = 0; i < data.length; i++) {
                const current = new Date(data[i].created_At);
                if (current <= dayActivated) {
                    var month = now.getMonth();
                    if (current.getDate() - firstDay.getDate() < 0) {
                        month++;
                    }
                    arrChat.push({
                        _id: mongoose.Types.ObjectId(data[i].id),
                        conversationId: conversationId,
                        userId: mongoose.Types.ObjectId(data[i].from_id),
                        content: data[i].message,
                        type: 'text',
                        replyFrom: data[i].reply_to
                            ? mongoose.Types.ObjectId(data[i].reply_to)
                            : data[i].reply_to,
                        createdAt: new Date(
                            now.getFullYear(),
                            month,
                            now.getDate() -
                                timeToActivated +
                                (current.getDate() - firstDay.getDate()),
                            current.getHours(),
                            current.getMinutes(),
                            current.getSeconds()
                        ),
                    });
                    // await Chat.create({
                    //     _id: mongoose.Types.ObjectId(data[i].id),
                    //     conversationId: conversationId,
                    //     userId: mongoose.Types.ObjectId(data[i].from_id),
                    //     content: data[i].message,
                    //     type: 'text',
                    //     replyFrom: data[i].reply_to
                    //         ? mongoose.Types.ObjectId(data[i].reply_to)
                    //         : data[i].reply_to,
                    //     createdAt: new Date(
                    //         now.getFullYear(),
                    //         month,
                    //         now.getDate() -
                    //             timeToActivated +
                    //             (current.getDate() - firstDay.getDate()),
                    //         current.getHours(),
                    //         current.getMinutes(),
                    //         current.getSeconds()
                    //     ),
                    // });
                    // const user = await User.findOne({
                    //     _id: mongoose.Types.ObjectId(data[i].from_id),
                    // });
                    // if (!user) {
                    if (
                        !arrUserID.find((userId) => userId == data[i].from_id)
                    ) {
                        const randomName = uniqueNamesGenerator({
                            dictionaries: [names, names],
                            length: 2,
                            separator: ' ',
                        });
                        arrUserID.push(data[i].from_id);
                        arrUser.push({
                            _id: mongoose.Types.ObjectId(data[i].from_id),
                            email: `${data[i].from_id}@gmail.com`,
                            password: password,
                            username: randomName,
                            verify: true,
                            desc: 'User from dataset',
                        });
                        // await User.create({
                        //     _id: mongoose.Types.ObjectId(data[i].from_id),
                        //     email: `${data[i].from_id}@gmail.com`,
                        //     password: password,
                        //     username: randomName,
                        //     verify: true,
                        //     desc: 'User from dataset',
                        // });
                        oldMembers.push(
                            mongoose.Types.ObjectId(data[i].from_id)
                        );
                    }
                    // else {
                    //     if (!oldMembers.includes(user._id)) {
                    //         oldMembers.push(user._id);
                    //     }
                    // }
                } else {
                    // const firstChat = await Chat.findOne({
                    //     conversationId: conversationId,
                    // });
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
            var previousTime;
            var count = 0;
            for (var i = 0; i < data.length; i++) {
                if (lastChat._id.equals(mongoose.Types.ObjectId(data[i].id))) {
                    flag = true;
                    previousTime = new Date(data[i].created_At);
                    continue;
                }
                if (flag) {
                    count++;
                    const current = new Date(data[i].created_At);
                    const distanceMonth =
                        current.getMonth() - previousTime.getMonth();
                    var distanceDate =
                        current.getDate() - previousTime.getDate();
                    if (distanceMonth != 0) {
                        distanceDate = distanceDate + 30 * distanceMonth;
                    }
                    const newTime = new Date(
                        lastChat.createdAt.getFullYear(),
                        lastChat.createdAt.getMonth(),
                        lastChat.createdAt.getDate() + distanceDate,
                        current.getHours(),
                        current.getMinutes(),
                        current.getSeconds()
                    );
                    if (newTime > now || count >= 500) {
                        await Conversation.updateOne(
                            { _id: conversationId },
                            {
                                member: oldMembers,
                                countForSuggestion: 500,
                                // updatedAt note cai nay
                            }
                        );
                        break;
                    }
                    await Chat.create({
                        _id: mongoose.Types.ObjectId(data[i].id),
                        conversationId: conversationId,
                        userId: mongoose.Types.ObjectId(data[i].from_id),
                        content: data[i].message,
                        type: 'text',
                        replyFrom: data[i].reply_to
                            ? mongoose.Types.ObjectId(data[i].reply_to)
                            : data[i].reply_to,
                        createdAt: newTime,
                    });
                    const user = await User.findOne({
                        _id: mongoose.Types.ObjectId(data[i].from_id),
                    });
                    if (!user) {
                        const randomName = uniqueNamesGenerator({
                            dictionaries: [names, names],
                            length: 2,
                            separator: ' ',
                        });
                        await User.create({
                            _id: mongoose.Types.ObjectId(data[i].from_id),
                            email: `${data[i].from_id}@gmail.com`,
                            password: password,
                            username: randomName,
                            verify: true,
                            desc: 'User from dataset',
                        });
                        oldMembers.push(
                            mongoose.Types.ObjectId(data[i].from_id)
                        );
                    } else {
                        if (!oldMembers.includes(user._id)) {
                            oldMembers.push(user._id);
                        }
                    }
                }
            }
        }
        process.exit(0);
    });
};

module.exports = PushData;