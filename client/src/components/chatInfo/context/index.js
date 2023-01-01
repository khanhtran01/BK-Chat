// import { createContext, useReducer, useContext, useEffect } from "react";
// import { chatboardReducer } from "../reducer";
// import { conversationContext } from "../../../context";
// const chatboardContext = createContext();

// function ChatInfoContextProvider({ children }) {
//   // const { userData } = useContext(conversationContext);
//   const { userData } = useContext(conversationContext);
//   const [messageData, dispatch] = useReducer(chatboardReducer, {
//     message: "",
//     replyFor: "",
//     tagList: [],
//   });
//   const checkTags = (message) => {
//     const tagList = message.split("@");
//     if (tagList.length > 1) {
//       let memlist = [];
//       for (let i = 0; i < userData.chatInfo.member.length; i++) {
//         memlist = [
//           ...memlist,
//           {
//             name: userData.chatInfo.member[i].username,
//             avatar: userData.chatInfo.member[i].avatar,
//           },
//         ];
//       }

//       const containList = [];
//       // eslint-disable-next-line array-callback-return
//       memlist.map((mem) => {
//         if (mem.name){
//           if (mem.name.toLowerCase().includes(tagList.last().toLowerCase())) {
//             containList.push(mem);
//           }
//         }
//       });
//       dispatch({ type: "SET_TAG_LIST", payload: containList });
//     } else {
//       dispatch({ type: "SET_TAG_LIST", payload: [] });
//     }
//   };

//   const handleTag = (username) => {
//     const tagList = messageData.message.split("@");
//     tagList[tagList.length - 1] = username;
//     dispatch({ type: "HANDLE_TAG", payload: tagList.join("@") });
//   };

//   const typeMessage = (message) => {
//     dispatch({ type: "TYPE_MESSAGE", payload: message });
//     checkTags(message);
//   };
//   const reply = (chat) => {
//     // SET_REPLY
//     dispatch({ type: "SET_REPLY", payload: chat });
//   };

//   const clearReply = () => {
//     dispatch({ type: "CLEAR_REPLY" });
//   };

//   useEffect(() => {
//     dispatch({ type: "RESET" });
//   }, [userData.currConversationId]);

//   const contextData = {
//     messageData,
//     typeMessage,
//     reply,
//     clearReply,
//     handleTag,
//   };
//   return (
//     <chatboardContext.Provider value={contextData}>
//       {children}
//     </chatboardContext.Provider>
//   );
// }
// export { chatboardContext };
// export default ChatBoardContextProvider;
