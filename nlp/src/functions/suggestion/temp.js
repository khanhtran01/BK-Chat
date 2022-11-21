require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3500;
const mongoose = require('mongoose');
const moment = require('moment');
const http = require("http");
const server = http.createServer(app);
const Account = require('../../models/Account')
const Conversation = require('../../models/Conversation')
const Chat = require('../../models/Chat')
const fs = require('fs');
const axios = require('axios');

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

// connect();

// https://stackoverflow.com/a/64414875/19518308
function combinations(arr, k, prefix=[]) {
    if (k == 0) return [prefix];
    return arr.flatMap((v, i) =>
    combinations(arr.slice(i+1), k-1, [...prefix, v])
    );
}
// function combinations(arr, k){
//     let set = [...arr];
//     if (k > set.length || k <= 0) return [];
//     if (k === set.length) return [set];
  
//     return set.reduce((p, c, i) => {
//       combinations(set.slice(i + 1), k - 1)
//         .forEach(tailArray => p.push([c].concat(tailArray)));
//       return p;
//     }, []);
// }

function checkConnection(data, acceptList) {

    for (let i = 0; i < data.length; i++) {
        let sum = 0;
        acceptList.forEach(idx => {
            sum += data[i][idx];
        })
        if (sum < acceptList.length) {
            return false;
        }
    }
    return true;
}


/**
 * TODO convert path to 2d array with index is length of path and elements is array of uid
 * @param {Array} path
 * @return {Array[Array]}
 */
function convertToLengthArray(path) {
    // find max length of path
    let maxLenght = 0;
    Object.keys(path).map(uid => {
        if (path[`${uid}`].length > maxLenght) {
            maxLenght = path[`${uid}`].length;
        }
    })

    let result = new Array(maxLenght + 1).fill([]);
    let i = 0;
    Object.keys(path).map(uid => {
        result[path[`${uid}`].length] = [...result[path[`${uid}`].length], i];
        i++;
    })
    // console.log(result[5]);
    return result;

}

function convertToBinaryMap(data) {
    const keysList = Object.keys(data);
    const result = [];
    for (let i = 0; i < keysList.length; i++) {
        let temp = [];
        keysList.map(uid => {
            if (data[`${keysList[i]}`].includes(uid) || keysList[i] == uid){
                temp.push(1);
            } else {
                temp.push(0);
            }
        })
        result.push(temp);
    }
    return result;
}

function getPath(data){
    const results = {};
    data.map(relationship => {
        if (results[`${relationship[0]}`] === undefined){
            results[`${relationship[0]}`] = [relationship[1]];
        } else {
            results[`${relationship[0]}`].push(relationship[1]);
        }

        if (results[`${relationship[1]}`] === undefined){
            results[`${relationship[1]}`] = [relationship[0]];
        } else {
            results[`${relationship[1]}`].push(relationship[0]);
        }
    })
    return results;
}

function userPairing(userList){
    const result = [];
    for(let i = 0 ; i < userList.length - 1; i++) {
        for(let j = i + 1 ; j < userList.length; j++) {
            result.push([userList[i], userList[j]]);
        }
    }
    return result;
}

function getUserIDList(data) {
    const userList = {}
    data.map(user => {
        userList[`${user.uid}`] = true;
    })
    return Object.keys(userList);
}

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
            currTime = new Date(chat.time);
            currId = chat.uid;
            if ((chat.uid === uidA && chat.replyFrom === uidB) || (chat.uid === uidB && chat.replyFrom === uidA)) {
                connectCount++;
                basisCount++;
            } else if (oldId != null && currId !== oldId ){
                connectCount++;
                if ((currTime.getTime() - oldTime.getTime())/1000 <= avg*0.5 && chat.replyFrom === null){
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
            currTime = new Date(chat.time);
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
async function getAllMessage(conversationId, backToDays){
    const result = await axios.get(`http://localhost:4000/api/chat/get?conversationId=${conversationId}&backToDays=${backToDays}`);
    return result.data.chats;
}

async function getChatGroup() {
    const response = await axios.get(`http://localhost:4000/api/conversation/sugestion?timeActive=${20}`)
    if (response.data.successful === true) {
        response.data.conversations.forEach(e => todo(e._id, 15))
    }
}

async function todo(conversationId, backToDays){
    // get data of 7 days of conversation id 6344e91b89558fb2b5ec1234
    const data = await getAllMessage(conversationId, backToDays);

    // get dentaTime list of this data
    const dentaTime = getDentaTimeList(data);
    // caculate average time from denta time list
    const avgTime = getSumFromArray(dentaTime)/dentaTime.length;
    // get all paring between 2 users
    const paringList = userPairing(getUserIDList(data));
    // all paring with > 20% reply Rate
    const filterParingList = [];

    for (let i = 0; i < paringList.length; i++) {
        let replyRate = calcReplyRate(data, paringList[i][0], paringList[i][1], avgTime);
        if (replyRate >= 0.4 && replyRate != 1) {
            paringList[i].push(replyRate);
            filterParingList.push(paringList[i]);
        }
    }
    // !! số thứ tự từ 0-> n dựa vào object.keys(path)
    const path = getPath(filterParingList); // path : { 'a' : [b,s,g,r,z], 'b' : [a,b,r,h,w,g], ...}
    const lengthArray = convertToLengthArray(path); // index là độ dài của path, các elements là số thứ tự của các id có độ dài index
    const biMap = convertToBinaryMap(path);;


    // * tìm các tổ hợp dài nhất 
    // console.log(path);
    const res = [];
    for(let i = lengthArray.length - 1; i > 1 ; i--){
        // console.log("==========================================");
        // console.log(`i = ${i}`);
        let rest = lengthArray.slice(i - lengthArray.length);
        let merged = rest.reduce(function(prev, next) {
            return prev.concat(next);
          });
        // console.log(merged);
        if (merged.length < i + 1){
            continue;
        } else {
            // console.log(`to hop ${i+1} so lien ket >= ${i}`);
            let listCombination = combinations(merged, i+1)
            // console.log(listCombination);
            let listBit = listCombination.map(combination => {
                return combination.map(idx => biMap[idx]);
            })
            for (let i = 0; i < listCombination.length; i++) {
                if (checkConnection(listBit[i], listCombination[i])) {
                    // console.log("***********Congratulations************");
                    // console.log("output : ");
                    // console.log(listCombination[i]);
                    res.push(listCombination[i]);
                }
            }
        }
        // console.log("==========================================");
    }

    // console.log(biMap);
    // console.log(res);
    for (let i = 0; i < res.length; i++) {
        res[i] = res[i].map(idx => {
            return Object.keys(path)[idx];
        })
    }
    //
    for (let i = 0; i < res.length; i++) {
        await axios.post('http://localhost:4000/api/notification/new', {
            members: res[i],
            conversationId: conversationId
        })
    }
    console.log(res);
    console.log("done~!");
    process.exit(0);
}


// console.log(combinations([0,1,2,3,4], 3));

// todo();

getChatGroup()

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
