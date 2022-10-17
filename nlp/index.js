require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3500;
const mongoose = require('mongoose');
const http = require("http");
const server = http.createServer(app);
const Account = require('./models/Account')
const Conversation = require('./models/Conversation')
const Chat = require('./models/Chat')

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

// Init Google Cloud Natural Language Api 
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();
const classificationModelOptions = {
    v2Model: {
        contentCategoriesVersion: 'V2',
    },
};

function concatChat(chat1, chat2) {
    return chat1.concat(" ", chat2);
}

async function getClassifies(text) {

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };
    // Classifies text in the document
    const [classification] = await client.classifyText({
        document,
        classificationModelOptions,
    });
    const categories = []
    classification.categories.forEach(category => {
        // if (category.confidence >= 0.5) {
        // }
        categories.push({name: category.name, rate: category.confidence})
    });
    console.log(categories)
    return categories;
}

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
//         console.log(getClassifies(totalData));  // array of suggestions
//     })
// }

// async function suggestionAllConversation() {
//     try {
//         const conversations = await Conversation.find({
//             'type': 'group',
//             '$expr': { $gte: [{ $size: '$member' }, 5] }
//         }, { desc: 0, avatar: 0 })
//         console.log(conversations);
//         for (const conversation of conversations) {
//             suggestionEachConversation(conversation)
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

// suggestionAllConversation()

// getClassifies("A class should have only a single responsibility. Only one potential change in the software's specification should be able to affect the specification of the class.")
getClassifies("That actor on TV makes movies in Hollywood and also stars in a variety of popular new TV shows.")


// app.get('/api/nlp', async (req, res) => {
//     try {
//         res.status(200).json() 
//     } catch (error) {
//         console.log(error);
//     }
// })

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
