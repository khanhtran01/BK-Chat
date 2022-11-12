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

/**
 * TODO: caculate the friendly ratio between 2 users
 * @param {Object} data list of chat in conversation
 * @param {String} uidA id of user
 * @param {String} uidB id of user
 * @param {Number} avg average dentaTime of all users
 * @returns {Object} friendly ratio between 2 users
 */
function calcReplyRate(data ,uidA, uidB, avg){
    let basisCount = 0; // count of reply
    let advantageCount = 0; // count of little dentaTime 
    let connectCount = 0;
    let currTime, oldTime, currId, oldId = null;
    data.map(chat => {
        if (chat.uid === uidA || chat.uid === uidB ) {
            currTime = chat.time;
            currId = chat.uid;
            if ((chat.uid === uidA && chat.replyFrom === uidB) || (chat.uid === uidB && chat.replyFrom === uidA)) {
                connectCount++;
                basisCount++;
            } else if (oldId != null && currId !== oldId ){
                connectCount++;
                if ((currTime.getTime() - oldTime.getTime())/1000 <= avg*0.2 && chat.replyFrom === null){
                    advantageCount++;
                }
            }
            oldTime = currTime;
            oldId = currId;
        }
    })
    // return dentaTime;
    // console.log("reply rate :" + (basisCount + advantageCount) / connectCount );
    return (basisCount + advantageCount) / connectCount;
}
/**
 * TODO: caculate sum of all element in array
 * @param {Object} data array of elements
 * @returns {Number} sum of all elements in array
 */
function getSumFromArray(data){
    return data.reduce((partialSum ,a) => partialSum + a, 0)
}
/**
 * TODO: get list denta time of all users, this function can use to get dentaTime of 2 users
 * @warning 
 * ! This result demands on fix time is 6 hours
 * @param {Object} id
 * @returns {Object} list of chat
 */
function getDentaTimeList(data, idA = "", idB = "") {
    let currTime, oldTime, currId, oldId = null;
    let dentaTime = [];
    data.map(chat => {
        if (chat.uid === idA || chat.uid === idB || (idA === "" && idB === "")) {
            currTime = chat.time;
            currId = chat.uid;
            //* if dentaTime over 6 hours will be skip
            if (oldId != null && currId !== oldId && (currTime.getTime() - oldTime.getTime()) <= 6 * 60 * 60 * 1000){
                dentaTime.push((currTime.getTime() - oldTime.getTime())/1000);
            }
            oldTime = currTime;
            oldId = currId;
        }
    })
    return dentaTime;
}
/**
 * TODO: get all chat of conversationID
 * @param {Object} id
 * @returns {Object} list of chat
 */
async function getAllMessage(id,rgg){
    let listMessages = await Chat.find({})
    let newList = [];
    listMessages.map(message => {
        newList.push({
            time: message.createdAt,
            uid: message.userId,
            replyFrom: message.replyFrom,
        })
    })
    return newList;
}
async function todo(){
    // data of one conversation
    const data = await getAllMessage();
    const dentaTime = getDentaTimeList(data);
    const avgTime = getSumFromArray(dentaTime)/dentaTime.length;
    const replyRate = calcReplyRate(data, '383935313139303832616161', '333833373631353439616161', avgTime);
    console.log("reply rate: " + replyRate);

}
todo();
server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
