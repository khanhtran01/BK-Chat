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
        await mongoose.connect(process.env.MONGODB_SERVER, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect Successful !!');
    } catch (error) {
        console.log('Connect Failed !!');
    }
}

connect();

// function concatChat(chat1, chat2) {
//     return chat1.concat(" ", chat2);
// }

// async function suggestionEachConversation(conversation) {
//     let classifies = []
//     conversation.member.forEach((memberId) => {
//         var chats = await Chat.find({
//             conversationId: conversation._id,
//             userId: memberId
//         }, { userRead: 0 })
//             .sort({ 'createdAt': -1 })
//             .limit(10)
//         let totalData = "";
//         chats.forEach((chat) => {
//             totalData = concatChat(totalData, chat.content);
//         })
//         // console.log(getClassifies(totalData));  // array of suggestions
//     })
// }

// async function suggestionAllConversation() {
//     try {
//         const conversations = await Conversation.find({
//             'type': 'group',
//             '$expr': { $gte: [{ $size: '$member' }, 5] }
//         }, { desc: 0, avatar: 0 })
//         for (const conversation of conversations) {
//             suggestionEachConversation(conversation)
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

// suggestionAllConversation()

// getClassifies("A class should have only a single responsibility. Only one potential change in the software's specification should be able to affect the specification of the class.")
// getClassifies("That actor on TV makes movies in Hollywood and also stars in a variety of popular new TV shows.")


// app.get('/api/nlp', async (req, res) => {
//     try {
//         res.status(200).json() 
//     } catch (error) {
//         console.log(error);
//     }
// })
function countReply(uidA, uidB){
    let count = 0;
}

function getSumFromArray(data){
    return data.reduce((partialSum ,a) => partialSum + a, 0)
}

function getDentaTimeList(data, idA = "", idB = "") {
    let currTime, oldTime, currId, oldId = null;
    let dentaTime = [];
    data.map(chat => {
        if (chat.uid === idA || chat.uid === idB || (idA === "" && idB === "")) {
            currTime = chat.time;
            currId = chat.uid;
            if (oldId != null && currId !== oldId && (currTime.getTime() - oldTime.getTime()) <= 6 * 60 * 60 * 1000){
                dentaTime.push((currTime.getTime() - oldTime.getTime())/1000);
            }
            oldTime = currTime;
            oldId = currId;
        }
    })
    return dentaTime;
}

async function getALlMessage(){
    let listMessages = await Chat.find({})
    let newList = [];
    listMessages.map(message => {
        newList.push({
            time: message.createdAt,
            uid: message.userId,
            replyFrom: message.replyFrom,
        })
    })
    const A_B = getDentaTimeList(newList, '383935313139303832616161', '393734363638393835616161' )
    console.log('=============AVG TIME OF A AND B=======================');
    console.log(getSumFromArray(A_B)/A_B.length);
    console.log('====================================');
    const all = getDentaTimeList(newList)
    console.log('=============AVG TIME OF ALL USER================');
    console.log(getSumFromArray(all)/all.length);
    console.log('====================================');
}

getALlMessage();

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
