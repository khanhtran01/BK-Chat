import { createContext, useReducer } from "react";
import { chatboardReducer } from "../reducer";
const chatboardContext = createContext();

function ChatBoardContextProvider({ children }) {
  // const { userData } = useContext(conversationContext);
  const [messageData, dispatch] = useReducer(chatboardReducer, {
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
