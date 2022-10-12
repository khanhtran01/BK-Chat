import { createContext, useReducer, useEffect } from "react";
import { chatboardReducer } from "../reducer";

const chatboardContext = createContext();

function ChatBoardContextProvider({ children }) {
  const [userData, dispatch] = useReducer(chatboardReducer, {
    message: "",
  });

  const typeMessage = (message) => {
    dispatch({ type: "TYPE_MESSAGE", payload: message });
  };

  const contextData = { userData, typeMessage };
  return (
    <chatboardContext.Provider value={contextData}>
      {children}
    </chatboardContext.Provider>
  );
}
export { chatboardContext };
export default ChatBoardContextProvider;
