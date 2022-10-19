require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
const route = require("./routes");
const cookieParse = require("cookie-parser");
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");

const db = require("./config/db/index");
const {
    addUser,
    removeUser,
    getUser,
    getUserBySocketId,
    getStatusUsers,
} = require("./util/userSocket");
const ChatController = require("./app/controllers/ChatController");

db.connect();
// Middlleware built-in
app.use(
    express.urlencoded({
        extended: true,
    })
); // unicode
app.use(express.json()); // axios, ajax
app.use(cookieParse(process.env.COOKIE_SECRECT)); //cookie parser

// Set up
app.use(morgan("combined"));
app.use(cors());

// Create socketio
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("sendJoin", data => {
        addUser(data.userId, socket.id);
        const senderUser = getUser(data.userId);
        const userOnline = getStatusUsers(data.allContact);
        io.to(senderUser?.socketId).emit("getUserOnline", userOnline);
        userOnline.forEach(element => {
            const friendUser = getUser(element.userId);
            io.to(friendUser?.socketId).emit("getFriendOnline", {
                userId: data.userId
            });
        });
    });

    // socket.on("sendNewContact", async (data) => {
    //     const receiverUser = getUser(data.receiverId);
    //     io.to(receiverUser?.socketId).emit("getNewContact", {
    //         senderId: data.senderId,
    //         username: data.username,
    //         avatar: data.avatar,
    //         receiverId: data.receiverId,
    //         content: data.content,
    //         conversationId: data.conversationId,
    //         time: data.time,
    //     });
    // });

    // socket.on('sendNewGroup', async (data) => {
    //     data.memberIdAndAva.forEach(e => {
    //         if (e.id != data.senderId) {
    //             var receiverUser = getUser(e.id);
    //             io.to(receiverUser?.socketId).emit("getNewGroup", {
    //                 senderId: data.senderId,
    //                 nameGroup: data.nameGroup,
    //                 messId: data.messId,
    //                 memberIdAndAva: data.memberIdAndAva
    //             });
    //         }
    //     })
    // })
    // senderId, receiverId, conversationId, content, replyFromChatId, time, 
    socket.on("sendChatSingle", async (data) => {
        data.type = "text";
        const chatId = await ChatController.storeChatAndGetId(data);
        const receiverUser = getUser(data.receiverId);
        const senderUser = getUser(data.senderId);
        io.to(receiverUser?.socketId)
            .to(senderUser?.socketId)
            .emit("getChatSingle", {
                senderId: data.senderId,
                receiverId: data.receiverId,
                conversationId: data.conversationId,
                content: data.content,
                chatId: chatId,
                time: data.time,
                replyFromChatId: data.replyFromChatId,
            });
    });

    // socket.on('sendMessageGroup', async (data) => {
    //     data.type = 'text'
    //     const chatId = await ChatController.storeChatAndGetId(data);
    //     io.to(data.messId).emit('getMessageGroup', {
    //         senderId: data.senderId,
    //         message: data.message,
    //         messId: data.messId,
    //         chatId: chatId,
    //         time: data.time
    //     })
    // })

    // socket.on('sendReactionChatSingle', async (data) => {
    //     const receiverUser = getUser(data.receiverId);
    //     const senderUser = getUser(data.senderId);
    //     const totalReactions = await ChatController.addReactionChat(data);
    //     io.to(receiverUser?.socketId).to(senderUser?.socketId).emit("getReactionChatSingle", {
    //         senderId: data.senderId,
    //         receiverId: data.receiverId,
    //         chat_id: data.chat_id,
    //         totalReactions: totalReactions
    //     });
    // })

    // socket.on('sendReactionChatGroup', async (data) => {
    //     const totalReactions = await ChatController.addReactionChat(data);
    //     io.to(data.messId).emit("getReactionChatGroup", {
    //         senderId: data.senderId,
    //         messId: data.messId,
    //         chat_id: data.chat_id,
    //         totalReactions: totalReactions
    //     });
    // })

    // socket.on('sendNotifyChatCustomAndOut', async (data) => {
    //     data.type = 'notify'
    //     const chatId = await ChatController.storeChatAndGetId(data);
    //     io.to(data.messId).emit("getNotifyChatCustomAndOut", {
    //         senderId: data.senderId,
    //         senderName: data.senderName,
    //         messId: data.messId,
    //         chatId: chatId,
    //         message: data.message
    //     });
    // })

    // socket.on('sendNotifyChatAddMem', async (data) => {
    //     data.type = 'addmember'
    //     const chatId = await ChatController.storeChatAndGetId(data);
    //     io.to(data.messId).emit("getNotifyChatAddMem", {
    //         senderId: data.senderId,
    //         senderName: data.senderName,
    //         memberId: data.memberId,
    //         memberName: data.memberName,
    //         message: data.message,
    //         chatId: chatId,
    //         messId: data.messId,
    //     });
    // })

    socket.on("disconnect", () => {
        console.log("user disconnected");
        const user = getUserBySocketId(socket.id);
        removeUser(socket.id);
        io.emit("getUserOff", user);
    });
});

// Routes init
route(app);
server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
