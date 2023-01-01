// import React, { useContext } from "react";
// import { chatboardContext } from "../context";
// import { AuthContext } from "../../../context/authContext";
// import { SocketContext } from "../../../context/socket";
// import { conversationContext } from "../../../context";
// const { socket } = useContext(SocketContext);
// const { authState } = useContext(AuthContext);
// const { messageData, typeMessage, clearReply } = useContext(chatboardContext);
// const { userData } = useContext(conversationContext);
// const sendMessage = () => {
//     const tagList = [];
//     // eslint-disable-next-line array-callback-return
//     userData.chatInfo.member.map((mem) => {
//         if (messageData.message.includes("@" + mem.username)) {
//             tagList.push(mem._id);
//         }
//     });
//     if (userData.chatInfo.type === "single") {
//         socket.emit("sendChatSingle", {
//             receiverId: userData.chatInfo.receiverId,
//             content: messageData.message,
//             time: moment(),
//             replyFromChatId: messageData.replyFor
//                 ? messageData.replyFor._id
//                 : null,
//             sender: authState.user,
//             conversationId: userData.currConversationId,
//             tagList: tagList,
//         });
//     } else {
//         socket.emit("sendChatGroup", {
//             content: messageData.message,
//             time: moment(),
//             replyFromChatId: messageData.replyFor
//                 ? messageData.replyFor._id
//                 : null,
//             sender: authState.user,
//             conversationId: userData.currConversationId,
//             tagList: tagList,
//         });
//     }
//     typeMessage("");
//     clearReply();
// };

// export default sendMessage;
