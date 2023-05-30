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
const nodemailer = require('nodemailer');
const Queue = require('bull');

const db = require('./config/db/index');
const redis = require('./config/redis/index');

const Neo4jMiddleware = require('./app/middlewares/Neo4jMiddleware');
const ChatController = require('./app/controllers/ChatController');
const UserController = require('./app/controllers/UserController');
const ConversationController = require('./app/controllers/ConversationController');

const { addUser, removeUser, getUser, getUserBySocketId, getStatusUsers } = require('./util/userSocket');
const handleNotify = require('./util/handleNotify');
const checkRecommend = require('./util/checkRecommend');
const mailVerify = require('./util/mailVerify');
const forgetPassword = require('./util/forgetPassword');

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
        origin: process.env.FE_URL,
    },
});

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
                _id: result?.id.toString(),
                createdAt: data.time,
                replyFrom: result?.replyChat,
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
            _id: result?.id.toString(),
            createdAt: data.time,
            replyFrom: result?.replyChat,
        });
    });

    socket.on('sendNewConversation', async (data) => {
        // type, time, content, senderEmail, senderId, senderUsername, senderAvatar, conversationId, receiverEmail.
        if (data.type === 'single') {
            const receiver = await UserController.findUserByEmail(data.receiverEmail);
            const receiverUser = await getUser(receiver._id.toString());
            io.to(receiverUser?.socketId).emit('getNewConversation', {
                conversationInfor: {
                    _id: data.conversationId,
                    name: 'Name conversation',
                    type: data.type,
                    member: [
                        {
                            _id: data.senderId,
                            email: data.senderEmail,
                            username: data.senderUsername,
                            avatar: data.senderAvatar,
                        },
                        {
                            _id: receiver._id,
                            email: receiver.email,
                            username: receiver.username,
                            avatar: receiver.avatar,
                        },
                    ],
                    desc: '',
                    avatar: null,
                    numUnRead: 1,
                    lastChat: {
                        content: data.content,
                        createdAt: data.time,
                    },
                },
            });
        }
        // type, time, content, members [userId], senderId, conversationId, conversationName
        if (data.type === 'group') {
            socket.join(data.conversationId);
            for (let i = 0; i < data.members.length; i++) {
                if (data.members[i] != data.senderId) {
                    const receiverUser = await getUser(data.members[i]);
                    io.to(receiverUser?.socketId).emit('getNewConversation', {
                        conversationInfor: {
                            _id: data.conversationId,
                            name: data.conversationName,
                            type: data.type,
                            member: [],
                            desc: '',
                            avatar: null,
                            numUnRead: 1,
                            lastChat: {
                                content: data.content,
                                createdAt: data.time,
                            },
                        },
                    });
                }
            }
        }
        // conversationId, conversationName, conversationAvatar, members [userId],
        if (data.type === 'addmember') {
            const lastChat = await ChatController.findLastChat(data.conversationId);
            for (let i = 0; i < data.members.length; i++) {
                const receiverUser = await getUser(data.members[i]);
                io.to(receiverUser?.socketId).emit('getNewConversation', {
                    conversationInfor: {
                        _id: data.conversationId,
                        name: data.conversationName,
                        type: 'group',
                        member: [],
                        desc: '',
                        avatar: data.conversationAvatar,
                        numUnRead: 1,
                        lastChat: {
                            _id: lastChat._id,
                            content: lastChat.content,
                            createdAt: lastChat.createdAt,
                        },
                    },
                });
            }
        }
    });
    // conversationId
    socket.on('addMemberGroup', (data) => {
        socket.join(data.conversationId);
    });
    // conversationId
    socket.on('newGroupFromSuggestion', async (data) => {
        const conversation = await ConversationController.getAllMembers(data.conversationId);
        for (let i = 0; i < conversation.member.length; i++) {
            const receiverUser = await getUser(conversation.member[i]);
            io.to(receiverUser?.socketId).emit('getNewConversation', {
                conversationInfor: {
                    _id: data.conversationId,
                    name: conversation.name,
                    type: conversation.type,
                    member: [],
                    desc: conversation.desc,
                    avatar: conversation.avatar,
                    numUnRead: 1,
                    lastChat: {
                        content: 'This group is created automatically by the system.',
                        createdAt: conversation.createdAt,
                    },
                },
            });
        }
    });

    socket.on('sendUserLogout', async (data) => {
        console.log('user logout');
        await removeUser(socket.id);
        io.emit('getUserOff', {
            userId: data.userId,
        });
    });

    socket.on('disconnect', async () => {
        console.log('user disconnected');
        const user = await getUserBySocketId(socket.id);
        if (user) {
            await removeUser(socket.id);
            io.emit('getUserOff', user);
        }
    });
});

// Routes init
route(app);

handleNotify.start();

checkRecommend.start();

const mailQueue = new Queue('mailQueuee', process.env.REDIS_URL);

mailQueue.process(async (job, done) => {
    const { adminEmail, adminPass, userEmail, randStr, feUrl, type } = job.data;
    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: adminEmail,
            pass: adminPass,
        },
    });

    if (type === 'verify') {
        const mailOptions = {
            from: `BK-Chat <${adminEmail}>`,
            to: `${userEmail}`,
            subject: '🚀 Verify your email ✔',
            html: mailVerify(randStr, userEmail, feUrl),
        };
        await transport.sendMail(mailOptions);
    } else {
        const mailOptions = {
            from: `BK-Chat <${adminEmail}>`,
            to: `${userEmail}`,
            subject: '🚀 BK-Chat reset password ✔',
            html: forgetPassword(randStr, userEmail, feUrl),
        };
        await transport.sendMail(mailOptions);
    }
    done();
});

module.exports = server;

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ successful: false });
});
server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
