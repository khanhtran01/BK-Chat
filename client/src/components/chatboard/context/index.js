import { createContext, useReducer, useContext } from "react";
import { chatboardReducer } from "../reducer";
import { AuthContext } from "../../../context/authContext"
import { conversationContext } from "../../../context";
const chatboardContext = createContext();

function ChatBoardContextProvider({ children }) {
  const { authState  } = useContext(AuthContext);
  // const { userData } = useContext(conversationContext);
  const [messageData, dispatch] = useReducer(chatboardReducer, {
    senderId: authState.user._id,
    message: "",
  });

  const typeMessage = (message) => {
    dispatch({ type: "TYPE_MESSAGE", payload: message });
  };

  const contextData = { messageData, typeMessage };
  return (
    <chatboardContext.Provider value={contextData}>
      {children}
    </chatboardContext.Provider>
  );
}
export { chatboardContext };
export default ChatBoardContextProvider;
