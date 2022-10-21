import io from "socket.io-client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
} from "react";
import { AuthContext } from "./authContext";
import { conversationContext } from ".";
import { socketReducer } from "../reducers/socketReducer";

const SocketContext = createContext();

const socket = io("http://localhost:4000");
function SocketProvider({ children }) {
  const [isConnected, setIsconnected] = useState(false);
  const { authState } = useContext(AuthContext);
  const { userData, updateFriendStatus, receiveMessage, addToWaitingStack } =
    useContext(conversationContext);

  const [socketData, dispatch] = useReducer(socketReducer, {
    onlineList: [],
    newMessageList: [],
  });

  useEffect(() => {
    socket.on("connect", () => {
      setIsconnected(true);
    });

    socket.on("disconnect", () => {
      setIsconnected(false);
    });

    /**
     * TODO open gateways to receive online list
     */
    socket.on("getUserOnline", (data) => {
      dispatch({ type: "GET_ONLINE_LIST", payload: data });
    });

    socket.on("getFriendOnline", (data) => {
      dispatch({ type: "UPDATE_ONLINE_LIST", payload: data });
    });

    socket.on("getUserOff", (data) => {
      dispatch({ type: "REMOVE_USER_OFFLINE", payload: data });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("getUserOnline");
      socket.off("getFriendOnline");
      socket.off("getUserOff");
    };
  }, []);

  /**
   * TODO function to require the server to return a list of users online
   * * function will run only if when user is authenticated
   */
  useEffect(() => {
    const sendPing = async () => {
      socket.emit("sendJoin", {
        userId: authState.user && authState.user._id,
        allContact: userData.contactList,
      });
    };
    sendPing();
  }, [authState.user, JSON.stringify(userData.contactList)]);

  useEffect(() => {
    socket.on("getChatSingle", (data) => {
      console.log(data);
      if (data.conversationId === userData.currConversationId) {
        receiveMessage(data);
      } else {
        addToWaitingStack(data);
      }
    });
    return () => {
      socket.off("getChatSingle");
    };
  }, [userData.currConversationId]);

  useEffect(() => {
    updateFriendStatus(socketData.onlineList);
  }, [JSON.stringify(socketData.onlineList)]);

  const contextValue = { socket };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
export { SocketContext };
export default SocketProvider;
