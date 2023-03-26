import { createContext, useReducer, useContext, useEffect, useState, useCallback } from "react";
import { chatboardReducer } from "../reducer";
import { EditReducer } from "../reducer/editReducer";
import { useMediaQuery } from "@mui/material";
import { conversationContext } from "../../../context";
import debounce from "lodash/debounce";
// import { stringify } from "uuid";
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
  
  // console.log("chatboard context render")
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

  const handleAvatar = (avatar) => {
    formDispatch({ type: "HANDLE_AVATAR", payload: avatar });
  }
  const handleDescription = (description) => {
    formDispatch({ type: "HANDLE_DESCRIPTION", payload: description })
  } 
  const handleName = (name) => {
    formDispatch({ type: "HANDLE_NAME", payload: name })
  }
  const handleDialog = useCallback((status) => {
    formDispatch({ type: "HANDLE_DIALOG", payload: status })
  },[])

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [userData.currConversationId]);

  const contextData = {
    messageData,
    editFormData,
    back,
    forward,
    setForward,
    // typeMessage,
    // reply,
    // clearReply,
    // handleTag,
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
