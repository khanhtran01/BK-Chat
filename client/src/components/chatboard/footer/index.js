import { Box, Typography } from "@mui/material";
import { bcolors, textcolor } from "../../../colors";
import React, { useState, useContext, memo, useMemo, useEffect } from "react";
import InputText from "../../typemessage";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import { chatboardContext } from "../context";
import Picker from "emoji-picker-react";
import moment from "moment";

import { AuthContext } from "../../../context/authContext";
import { SocketContext } from "../../../context/socket";
import { conversationContext } from "../../../context";
import Button from "@mui/material/Button";
import BtnIcon from "../../btnIcon";
import MessageInput from "./components/MessageInput";
import IconPicker from "./components/IconPicker";

function Footer() {
  const { socket } = useContext(SocketContext);
  const { messageData, typeMessage } = useContext(chatboardContext);
  const { userData } = useContext(conversationContext);
  const { authState } = useContext(AuthContext);

  const sendMessage = () => {
    console.log("sendding");
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
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "92px",
        backgroundColor: bcolors.chatboard,
        borderTop: `1px solid ${bcolors.bluedark}`,
        padding: "1.5rem 1rem",
      }}
    >
      <MessageInput />
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
        variant="contained"
        onClick={sendMessage}
      >
        <SendIcon />
      </Button>
    </Box>
  );
}

export default Footer;
