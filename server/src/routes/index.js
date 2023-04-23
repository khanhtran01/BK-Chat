const authRoute = require('./auth');
const userRoute = require('./user');
const notificationRoute = require('./notification');
const conversationRoute = require('./conversation');
const AuthenMiddleware = require('../app/middlewares/AuthenMiddleware');
const ServiceMiddleware = require('../app/middlewares/ServiceMiddleware');
const UserController = require('../app/controllers/UserController');
const ConversationController = require('../app/controllers/ConversationController');
const NotificationController = require('../app/controllers/NotificationController');
const ChatController = require('../app/controllers/ChatController');
const Neo4jController = require('../app/controllers/Neo4jController');

const multer = require('multer');
const Minio = require('minio');
const { Readable } = require('stream');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const minioClient = new Minio.Client({
    endPoint: '192.168.37.143',
    port: 9000,
    useSSL: false,
    accessKey: 'TRzPlYpsokhuotZ4',
    secretKey: 'NiURn2ocuDhCPme61iM75jFk6Z4TKPQW',
});

function route(app) {
    app.use('/api/user', AuthenMiddleware, userRoute);
    app.post('/api/test/upload', upload.single('img'), (req, res, next) => {
        try {
            const file = req.file;
            const bucketName = 'bk-chat';
            const metaData = {
                'Content-Type': file.mimetype, // Set the Content-Type header based on the uploaded file's MIME type
            };

            const fileStream = new Readable();
            fileStream.push(file.buffer);
            fileStream.push(null);

            minioClient.putObject(
                bucketName,
                file.originalname,
                fileStream,
                file.size,
                metaData,
                (err, etag) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: 'Failed to upload file' });
                    }

                    console.log('File uploaded successfully:', file.originalname);

                    // Return the URL for the uploaded file
                    const url =
                        minioClient.protocol +
                        '//' +
                        minioClient.host +
                        ':' +
                        minioClient.port +
                        '/' +
                        bucketName +
                        '/' +
                        file.originalname;
                    res.status(200).json({ message: 'File uploaded successfully', url: url });
                },
            );
        } catch (error) {
            next(error);
        }
    });
    // [GET] /api/notification/sugestion?timeActive
    app.get(
        '/api/conversation/sugestion',
        ServiceMiddleware,
        ConversationController.getConversationForSugestion,
    );
    //  [GET] /api/chat/get?conversationId?backToDays=
    app.get('/api/chat/get', ServiceMiddleware, ChatController.getChatForSuggestion);
    // [POST] /api/notification/new
    app.post('/api/notification/new', NotificationController.new);
    app.post('/api/notification/new-single', NotificationController.newSingle);
    app.get('/api/neo4j/get-all', Neo4jController.getAllUser);

    app.use('/api/conversation', AuthenMiddleware, conversationRoute);
    app.use('/api/notification', AuthenMiddleware, notificationRoute);
    app.use('/api/auth', authRoute);

    // [GET] /api/home
    app.use('/api/home', AuthenMiddleware, UserController.home);
}

module.exports = route;
