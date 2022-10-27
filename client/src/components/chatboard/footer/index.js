import { Box, Typography } from "@mui/material";
import { bcolors, textcolor } from "../../../colors";
import React, { useContext } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import { chatboardContext } from "../context";
import moment from "moment";
import InputText from "../../typemessage";
import { AuthContext } from "../../../context/authContext";
import { SocketContext } from "../../../context/socket";
import { conversationContext } from "../../../context";
import Button from "@mui/material/Button";
import BtnIcon from "../../btnIcon";
// import MessageInput from "./components/MessageInput";
import ClearIcon from "@mui/icons-material/Clear";
import IconPicker from "./components/IconPicker";

function Footer() {
  const { socket } = useContext(SocketContext);
  const { messageData, typeMessage, clearReply } = useContext(chatboardContext);
  const { userData } = useContext(conversationContext);
  const { authState } = useContext(AuthContext);

  const sendMessage = () => {
    console.log(messageData);
    socket.emit("sendChatSingle", {
      receiverId: userData.chatInfo.receiverId,
      content: messageData.message,
      time: moment(),
      replyFromChatId: null,
      sender: authState.user,
      conversationId: userData.currConversationId,
    });
    typeMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "92px",
        backgroundColor: bcolors.chatboard,
        borderTop: `1px solid ${bcolors.bluedark}`,
        padding: "1.5rem 1rem",
      }}
    >
      {messageData.replyFor && (
        <Box
          sx={{
            position: "absolute",
            // display: "flex",
            backgroundColor: bcolors.secondary,
            // justifyContent: "space-between",
            width: "100%",
            top: "-50px",
            height: "50px",
            left: 0,
            paddingLeft: "1rem",
            paddingY: "0.2rem",
          }}
        >
          <Box width="100%" display="flex">
            <Box
              width="96%"
              sx={{ color: textcolor.primaryGray, fontSize: "5px" }}
            >
              <Typography fontSize={"14px"}>Reply to Admin 123 :</Typography>
              <Typography
                fontSize={"13px"}
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                THis is the message created by Mr. ALex Fergurson to ManCity to
                require THis is the message created by Mr. ALex Fergurson to
                ManCity to require THis is the message created by Mr. ALex
                Fergurson to ManCity to require
              </Typography>
            </Box>
            <div onClick={clearReply}>
              <ClearIcon sx={{ color: textcolor.primaryGray }} />
            </div>
          </Box>
        </Box>
      )}

      <InputText
        text={messageData.message}
        setText={typeMessage}
        onKeyDown={handleKeyDown}
        disabled={userData.currConversationId === ""}
      />
      <IconPicker />

      <BtnIcon icon={<AttachFileIcon sx={{ color: bcolors.main }} />} />
      <Button
        sx={{
          width: "3rem",
          backgroundColor: bcolors.main,
          "&.MuiButton-root:hover": {
            backgroundColor: bcolors.secondary,
          },
        }}
        disabled={userData.currConversationId === ""}
        variant="contained"
        onClick={sendMessage}
      >
        <SendIcon />
      </Button>
    </Box>
  );
}

export default Footer;
