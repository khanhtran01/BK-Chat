import { createContext, useReducer, useContext, useEffect } from "react";
import { chatboardReducer } from "../reducer";
import { conversationContext } from "../../../context";
const chatboardContext = createContext();

function ChatBoardContextProvider({ children }) {
  // const { userData } = useContext(conversationContext);
  const [messageData, dispatch] = useReducer(chatboardReducer, {
    message: "",
    replyFor: "",
  });
  const { userData } = useContext(conversationContext);
  const typeMessage = (message) => {
    dispatch({ type: "TYPE_MESSAGE", payload: message });
  };
  const reply = (chat) => {
    // SET_REPLY
    dispatch({ type: "SET_REPLY", payload: chat });
  };
  const clearReply = () => {
    dispatch({ type: "CLEAR_REPLY" });
  };

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [userData.currConversationId]);

  const contextData = { messageData, typeMessage, reply, clearReply };
  return (
    <chatboardContext.Provider value={contextData}>
      {children}
    </chatboardContext.Provider>
  );
}
export { chatboardContext };
export default ChatBoardContextProvider;
