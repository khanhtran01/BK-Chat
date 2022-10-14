import Header from "./header";
import Footer from "./footer";
import Body from "./body";
import ChatBoardContextProvider from "./context";
function ChatBoard() {
  return (
    <ChatBoardContextProvider>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <Body />
        <Footer />
      </div>
    </ChatBoardContextProvider>
  );
}

export default ChatBoard;
