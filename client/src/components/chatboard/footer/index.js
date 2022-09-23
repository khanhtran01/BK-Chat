import { Box, Typography } from "@mui/material";
import { bcolors, textcolor } from "../../../colors";
import React, { useState } from "react";
import InputText from "../../typemessage";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import Picker from "emoji-picker-react";
import Button from "@mui/material/Button";
import BtnIcon from "../../btnIcon";
function Footer(props) {
  const [chosenEmoji, setChosenEmoji] = useState({});
  const [messageText, setMessageText] = useState("");
  const [displayPopup, setDisplayPopup] = useState(false);
  console.log(messageText);
  const onEmojiClick = async (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setDisplayPopup(!displayPopup);
    setMessageText(`${messageText}${emojiObject.emoji}`);
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
      <InputText text={messageText} setText={setMessageText} />
      <Box
        sx={{
          position: "relative",
        }}
      >
        <BtnIcon
          icon={<InsertEmoticonIcon sx={{ color: bcolors.main }} />}
          onClick={() => setDisplayPopup(!displayPopup)}
        />
        <Box
          sx={{
            display: displayPopup ? "block" : "none",
            position: "absolute",
            left: "-263px",
            bottom: "63px",
          }}
        >
          <Picker onEmojiClick={onEmojiClick} />
        </Box>
      </Box>

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

export default Footer;
