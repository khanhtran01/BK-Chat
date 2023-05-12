require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3500;
const mongoose = require('mongoose');
const http = require("http");
const server = http.createServer(app);
const Account = require('../../models/Account')
const Conversation = require('../../models/Conversation')
const Chat = require('../../models/Chat')

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_DB_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect Successful !!');
    } catch (error) {
        console.log('Connect Failed !!');
    }
}

connect();

async function BaoWork(conversationId = "", numberOfDays = "") {
    const chats = await Chat.find({}, { userId: 1, replyFrom: 1, createdAt: 1, content: 1 })
    let firstDay = chats[0].createdAt.getDate();
    let result = []
    let continuousChat = []
    let users = []
    for (let i = 0; i < chats.length - 1; i++) {
        if (chats[i + 1].createdAt - chats[i].createdAt < 180000) {
            continuousChat.push({
                time: chats[i].createdAt,
                uid: chats[i].userId,
                content: chats[i].content,
                replyFrom: chats[i].replyFrom,
            })
            !users.some((user) => user == chats[i].userId) &&
                users.push(chats[i].userId);
        } else {
            continuousChat.push(chats[i])
            if (continuousChat.length > 5) {
                result = result.concat(await analystSuggestion(continuousChat, users))
            }
            users = []
            continuousChat = []
        }
    }
    if (continuousChat.length > 5) {
        result = result.concat(await analystSuggestion(continuousChat, users))
    }
    console.log("🚀 ~ BaoWork ~ result", result)
    console.log("Done!!");
    process.exit(0);
}



async function analystSuggestion(continuousChat, users) {
    const data = await getAllMessage();
    const dentaTime = getDentaTimeList(data);
    const avgTime = getSumFromArray(dentaTime) / dentaTime.length;
    let results = []
    for (let i = 0; i < users.length - 1; i++) {
        for (let j = i + 1; j < users.length; j++) {
            let rate = calcReplyRate(continuousChat, users[i], users[j], avgTime);
            if (rate > 0.5) {
                let totalData1 = "";
                let totalData2 = "";
                continuousChat.forEach(e => {
                    if (e.uid == users[i]) {
                        totalData1 = concatChat(totalData1, e.content)
                    }
                    if (e.uid == users[j]) {
                        totalData2 = concatChat(totalData2, e.content)
                    }
                })
                let a = await getClassifies(totalData1)
                // console.log("🚀 ~ analystSuggestion ~ a", a)
                let b = await getClassifies(totalData2)
                // console.log("🚀 ~ analystSuggestion ~ b", b)
                if (a.length == 0 || b.length == 0) continue
                if (a[0].includes(b[0]) || b[0].includes(a[0])) results.push(users[i], users[j], a[0])
            }
        }
    }
    return results;
}
for (let j = 0; j < res[0].length; j++) {
    await analystChat(res[0][j], data)
    break
}
function concatChat(chat1, chat2) {
    return chat1.concat(". ", chat2);
}
async function analystChat(userId, chats) {
    let contents = ""
    let results = []
    let lastTimeChat = null
    for (let i = 0; i < chats.length; i++) {      
        if (chats[i].uid == userId) {
            if (lastTimeChat == null){
                lastTimeChat = chats[i].time
                contents = concatChat(contents, chats[i].content)
                continue
            }
            if (chats[i].time - lastTimeChat < 6*60*60*1000) {
                lastTimeChat = chats[i].time
                contents = concatChat(contents, chats[i].content)
                continue
            }
            results.push(contents)
            lastTimeChat = chats[i].time
            contents = chats[i].content
        }
    }
    let similar = {}
    let firstCategory = null
    let count = 0
    for (let i = 0; i < results.length; i++) {
        const categorie = await getClassifies(results[i])
        console.log("🚀 ~ analystChat ~ categories", categorie, i)
        if (firstCategory == null && categorie.length > 0) {
            firstCategory = categorie[0]
            continue
        }
        if ( categorie.length > 0 && 
            (categorie[0].includes(firstCategory) || firstCategory.includes(categorie[0]))
        ){
            // count++
            // similar.category = firstCategory
            // todo
        }
        similar.push({
            category: firstCategory,
            count
        })
    }
    console.log(userId, results);
}

BaoWork()