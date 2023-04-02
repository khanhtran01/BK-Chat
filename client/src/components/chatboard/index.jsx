import Header from "./header";
import Footer from "./footer";
import Body from "./body";
import { bcolors } from "../../colors";
import { Slide } from "@mui/material";
import { conversationContext } from "../../context";
import { useContext, memo } from "react";
import { chatboardContext } from "./context";
import { useMediaQuery } from "@mui/material";
import MessageContextProvider from "./context/messageContext";
import ReplyContextProvider from "./context/replyContext";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ChatInfo from "../chatInfo";
import { context } from "../../layout/dashboard/context";

import Slider from "./hello";
function ChatBoard() {
  const { userData } = useContext(conversationContext);
  const { back } = useContext(chatboardContext);
  const { chatInfoPopup, setChatInfoPopup } = useContext(context);

  const mobileView = useMediaQuery("(min-width:1000px)");
  return (
    <>
      {
        <Slide direction="left" in={!back}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: !back ? "flex" : "none",

              flexDirection: "column",
              backgroundColor: bcolors.chatboard,
            }}
          >
            {Object.keys(userData.chatInfo).length === 0 &&
            mobileView &&
            !userData.isLoadingConversation ? (
              <Slider />
            ) : (
              <>
                <Header />
                <ReplyContextProvider>
                  <Body />
                  <MessageContextProvider>
                    <Footer />
                  </MessageContextProvider>
                </ReplyContextProvider>
              </>
            )}
            <SwipeableDrawer
              anchor={"right"}
              open={chatInfoPopup}
              onClose={() => setChatInfoPopup(false)}
              onOpen={() => setChatInfoPopup(true)}
            >
              <ChatInfo />
            </SwipeableDrawer>
          </div>
        </Slide>
      }
    </>
  );
}

export default memo(ChatBoard);
