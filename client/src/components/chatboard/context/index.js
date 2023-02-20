import { createContext, useReducer, useContext, useEffect, useState } from "react";
import { chatboardReducer } from "../reducer";
import { EditReducer } from "../reducer/editReducer";
import { useMediaQuery } from "@mui/material";
import { conversationContext } from "../../../context";
const chatboardContext = createContext();

if (!Array.prototype.last) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
}

function ChatBoardContextProvider({ children }) {
  // const { userData } = useContext(conversationContext);
  const mobileView = useMediaQuery("(min-width:1000px)");
  const { userData } = useContext(conversationContext);
  const [messageData, dispatch] = useReducer(chatboardReducer, {
    message: "",
    replyFor: "",
    tagList: [],
  });
  

  const [back, setBack] = useState(!mobileView);
  const [forward, setForward] = useState(false);
  useEffect(()=>{
    if (mobileView){
      setBack(false);
      setForward(false);
    }
  }, [mobileView])
  const [editFormData, formDispatch] = useReducer(EditReducer, {
    name: "",
    avatar: {
      name: "",
      file: null,
    },
    description: "",
    openDialog: false,
  })


  const checkTags = (message) => {
    if (userData.chatInfo.type === "single") {
      return;
    }
    const tagList = message.split("@");
    if (tagList.length > 1) {
      let memlist = [];
      for (let i = 0; i < userData.chatInfo.member.length; i++) {
        memlist = [
          ...memlist,
          {
            name: userData.chatInfo.member[i].username,
            avatar: userData.chatInfo.member[i].avatar,
          },
        ];
      }

      const containList = [];
      // eslint-disable-next-line array-callback-return
      memlist.map((mem) => {
        if (mem.name.toLowerCase().includes(tagList.last().toLowerCase())) {
          containList.push(mem);
        }
      });
      dispatch({ type: "SET_TAG_LIST", payload: containList });
    } else {
      dispatch({ type: "SET_TAG_LIST", payload: [] });
    }
  };

  const handleTag = (username) => {
    const tagList = messageData.message.split("@");
    tagList[tagList.length - 1] = username;
    dispatch({ type: "HANDLE_TAG", payload: tagList.join("@") });
  };

  const typeMessage = (message) => {
    dispatch({ type: "TYPE_MESSAGE", payload: message });
    checkTags(message);
  };
  const reply = (chat) => {
    // SET_REPLY
    dispatch({ type: "SET_REPLY", payload: chat });
  };

  const clearReply = () => {
    dispatch({ type: "CLEAR_REPLY" });
  };

  const handleAvatar = (avatar) => {
    formDispatch({ type: "HANDLE_AVATAR", payload: avatar });
  }
  const handleDescription = (description) => {
    formDispatch({ type: "HANDLE_DESCRIPTION", payload: description })
  } 
  const handleName = (name) => {
    formDispatch({ type: "HANDLE_NAME", payload: name })
  }
  const handleDialog = (status) => {
    formDispatch({ type: "HANDLE_DIALOG", payload: status })
  }


  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [userData.currConversationId]);

  const contextData = {
    messageData,
    editFormData,
    back,
    forward,
    setForward,
    typeMessage,
    reply,
    clearReply,
    handleTag,
    handleAvatar,
    handleDescription,
    handleName,
    handleDialog,
    setBack
  };
  return (
    <chatboardContext.Provider value={contextData}>
      {children}
    </chatboardContext.Provider>
  );
}
export { chatboardContext };
export default ChatBoardContextProvider;
