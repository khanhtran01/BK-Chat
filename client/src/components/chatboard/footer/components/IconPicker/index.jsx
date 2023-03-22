import { Box } from "@mui/material";
import { bcolors } from "../../../../../colors";
import { useState, useContext, useMemo } from "react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
// import { chatboardContext } from "../../../context";
import { messageContext } from "../../../context/messageContext";
import BtnIcon from "../../../../btnIcon";
import Picker from "emoji-picker-react";

function IconPicker() {
  // const { message, typeMessage } = useContext(chatboardContext);
  const {  message, typeMessage} = useContext(messageContext);
  const [chosenEmoji, setChosenEmoji] = useState({});
  const [displayPopup, setDisplayPopup] = useState(false);
  const onEmojiClick = async (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setDisplayPopup(!displayPopup);
    typeMessage(`${message.message}${emojiObject.emoji}`);
  };
  return useMemo(
    () => (
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
    ),
    [chosenEmoji, displayPopup]
  );
}

export default IconPicker;
