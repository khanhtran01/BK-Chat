import Header from "./header";
import Footer from "./footer";
import Body from "./body";
import ChatBoardContextProvider from "./context";
import { bcolors } from "../../colors";

import { conversationContext } from "../../context";
import { useContext } from "react";
// import HelloComponent from "./hello";
import { context } from "../../layout/dashboard/context";
import Slider from "./hello";
function ChatBoard() {
  const { userData } = useContext(conversationContext);
  const { mobileView } = useContext(context);
  return (
    <ChatBoardContextProvider>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: bcolors.chatboard,
        }}
      >
        {Object.keys(userData.chatInfo).length === 0 ? (
          <Slider />
        ) : (
          <>
            <Header />
            <Body />
            <Footer />
          </>
        )}
      </div>
    </ChatBoardContextProvider>
  );
}

export default ChatBoard;
