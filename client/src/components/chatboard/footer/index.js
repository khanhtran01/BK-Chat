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
  const { messageData } = useContext(chatboardContext);
  const { userData } = useContext(conversationContext);
  const [chatInfo, setChatInfo] = useState(userData.chatInfo);

  // useEffect(() => {
  //   setChatInfo(userData.chatInfo);
  // }, [JSON.stringify(userData.chatInfo)])
  const sendMessage = () => {
    const today = new Date();
    console.log(messageData);
    console.log(userData.chatInfo);
    console.log({
      senderId: messageData.senderId,
      receiverId: userData.receiverId,
      content: messageData.message,
      time: moment(today).format('DD/MM/YYYY HH:mm:ss'),
      replyFromChatId: "111e1e11e1",
    })
    // socket.emit("sendChatSingle", data);
  }
  return <Box
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
}

export default memo(Footer);
