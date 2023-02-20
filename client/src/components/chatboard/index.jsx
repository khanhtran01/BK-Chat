import Header from "./header";
import Footer from "./footer";
import Body from "./body";
import { bcolors } from "../../colors";
import { Slide } from "@mui/material";
import { conversationContext } from "../../context";
import { useContext } from "react";
import { chatboardContext } from "./context";
import { useMediaQuery } from "@mui/material";

import Slider from "./hello";
function ChatBoard() {
  const { userData } = useContext(conversationContext);
  const { back, forward } = useContext(chatboardContext);
  const mobileView = useMediaQuery("(min-width:1000px)");
  return (
    <>
      {
        <Slide direction="left" in={!back}>
          <Slide direction="right" in={!forward}>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: !back && !forward ? "flex" : "none",
                flexDirection: "column",
                backgroundColor: bcolors.chatboard,
              }}
            >
              {Object.keys(userData.chatInfo).length === 0 && mobileView ? (
                <Slider />
              ) : (
                <>
                  <Header />
                  <Body />
                  <Footer />
                </>
              )}
            </div>
          </Slide>
        </Slide>
      }
    </>
  );
}

export default ChatBoard;
