import { Box, Typography } from "@mui/material";
import { bcolors, textcolor } from "../../../colors";
import React, { useState, useContext, memo } from "react";
import InputText from "../../typemessage";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import { chatboardContext } from "../context";
import Picker from "emoji-picker-react";

import { AuthContext } from "../../../context/authContext";
import { SocketContext } from "../../../context/socket";
import { conversationContext } from "../../../context";
import Button from "@mui/material/Button";
import BtnIcon from "../../btnIcon";
import MessageInput from "./components/MessageInput";
import IconPicker from "./components/IconPicker";

function Footer() {
  const { authState } = useContext(AuthContext);
  const { userData } = useContext(conversationContext);
  // const { sendPing } = useContext(SocketContext);
  // const { userData, typeMessage } = useContext(chatboardContext);
  // const [chosenEmoji, setChosenEmoji] = useState({});
  // // const [messageText, setMessageText] = useState("");
  // const [displayPopup, setDisplayPopup] = useState(false);
  // const onEmojiClick = async (event, emojiObject) => {
  //   setChosenEmoji(emojiObject);
  //   setDisplayPopup(!displayPopup);
  //   typeMessage(`${userData.message}${emojiObject.emoji}`);
  // };
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
      >
        <SendIcon />
      </Button>
    </Box>
  );
}

export default memo(Footer);
