require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;
const route = require('./routes');
const cookieParse = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');

const db = require('./config/db/index');
const { addUser, removeUser, getUser, getUserBySocketId, getStatusUsers } = require('./util/userSocket');
const ChatController = require('./app/controllers/ChatController');
const Neo4jMiddleware = require('./app/middlewares/Neo4jMiddleware');

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

db.connect();
// Middlleware built-in
app.use(
    express.urlencoded({
        extended: true,
    }),
); // unicode
app.use(express.json()); // axios, ajax
app.use(cookieParse(process.env.COOKIE_SECRECT)); //cookie parser

// Set up
app.use(morgan('combined'));
app.use(cors());

app.use(Neo4jMiddleware);

// Create socketio
const io = socketio(server, {
    cors: {
        origin: 'http://localhost:3000',
    },
});

const redis = require('./config/redis/index');

redis.connect(io);

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('sendJoin', async (data) => {
        addUser(data.userId, socket.id);
        const senderUser = await getUser(data.userId);
        const userOnline = await getStatusUsers(data.allContact);
        io.to(senderUser?.socketId).emit('getUserOnline', userOnline);
        for (element of userOnline) {
            const friendUser = await getUser(element.userId);
            io.to(friendUser?.socketId).emit('getFriendOnline', {
                userId: data.userId,
            });
        }
        data.allContact.forEach((element) => {
            if (element.type == 'group') {
                socket.join(element.conversationId);
            }
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
    socket.on('sendChatSingle', async (data) => {
        data.type = 'text';
        const result = await ChatController.storeChatAndGetId(data);
        const receiverUser = await getUser(data.receiverId);
        const senderUser = await getUser(data.sender._id);
        io.to(receiverUser?.socketId)
            .to(senderUser?.socketId)
            .emit('getChatSingle', {
                userId: {
                    _id: data.sender._id,
                    email: data.sender.email,
                    username: data.sender.username,
                    avatar: data.sender.avatar,
                },
                conversationId: data.conversationId,
                content: data.content,
                _id: result.id,
                createdAt: data.time,
                replyFrom: result.replyChat,
            });
    });

    socket.on('sendChatGroup', async (data) => {
        data.type = 'text';
        const result = await ChatController.storeChatAndGetId(data);
        io.to(data.conversationId).emit('getChatGroup', {
            userId: {
                _id: data.sender._id,
                email: data.sender.email,
                username: data.sender.username,
                avatar: data.sender.avatar,
            },
            conversationId: data.conversationId,
            content: data.content,
            _id: result.id,
            createdAt: data.time,
            replyFrom: result.replyChat,
        });
    });

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

    socket.on('sendUserLogout', async (data) => {
        await removeUser(data.userId);
        io.emit('getUserOff', {
            userId: data.userId,
        });
    });

    socket.on('disconnect', async () => {
        console.log('user disconnected');
        const user = await getUserBySocketId(socket.id);
        await removeUser(socket.id);
        io.emit('getUserOff', user);
    });
});

// Routes init
route(app);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ successful: false });
});
server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
