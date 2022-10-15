import io from "socket.io-client";
import { createContext, useState, useEffect } from "react";

const SocketContext = createContext();

const socket = io("http://localhost:4000");
function SocketProvider({ children }) {
  const [isConnected, setIsconnected] = useState(false);
  const [lastPong, setLastPong] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsconnected(true);
    });

    socket.on("disconnect", () => {
      setIsconnected(false);
    });

    socket.on("pong", (data) => {
      setLastPong(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);

  const sendPing = (data) => {
    socket.emit("sendJoin", data);
    console.log(lastPong);
  };

  const contextValue = { socket, sendPing };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
export { SocketContext };
export default SocketProvider;
