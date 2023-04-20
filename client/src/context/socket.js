/* eslint-disable react-hooks/exhaustive-deps */
import io from "socket.io-client";
import {
  createContext,
  // useState,
  useEffect,
  useContext,
  useReducer,
} from "react";
import { AuthContext } from "./authContext";
import { conversationContext } from ".";
import { socketReducer } from "../reducers/socketReducer";
import { useCookies } from "react-cookie";

const SocketContext = createContext();

const socket = io(`${process.env.REACT_APP_SERVER_ADDRESS}`);
function SocketProvider({ children }) {
  // const [isConnected, setIsconnected] = useState(false);
  const { authState, logoutUser } = useContext(AuthContext);
  const [cookie, setCookie, removeCookie] = useCookies();
  const { userData, updateFriendStatus, receiveMessage, addToWaitingStack, reset_logout } =
    useContext(conversationContext);

  const [socketData, dispatch] = useReducer(socketReducer, {
    onlineList: [],
    newMessageList: [],
  });

  useEffect(() => {
    socket.on("connect", () => { });

    socket.on("disconnect", () => { });

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
      console.log(data);
      if (data.userId) {
        dispatch({ type: "REMOVE_USER_OFFLINE", payload: data });
      }
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
      if (authState.user) {
        socket.emit("sendJoin", {
          userId: authState.user && authState.user._id,
          allContact: userData.contactList,
        });
      }

    };
    sendPing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.user, JSON.stringify(userData.contactList)]);

  useEffect(() => {
    socket.on("getChatSingle", (data) => {
      if (data.conversationId === userData.currConversationId) {
        receiveMessage(data);
      } else {
        addToWaitingStack(data);
      }
    });
    socket.on("getChatGroup", (data) => {
      if (data.conversationId === userData.currConversationId) {
        receiveMessage(data);
      } else {
        addToWaitingStack(data);
      }
    });

    return () => {
      socket.off("getChatSingle");
      socket.off("getChatGroup");
    };
  }, [userData.currConversationId]);

  useEffect(() => {
    updateFriendStatus(socketData.onlineList);
  }, [JSON.stringify(socketData.onlineList)]);

  const logout = () => {
    removeCookie("token", { path: "/" });
    logoutUser();
    if (authState.user) {
      socket.emit("sendUserLogout", {
        userId: authState.user._id
      })
    }
    reset_logout();
  }

  const contextValue = { socket, logout };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
export { SocketContext };
export default SocketProvider;
