import { Box } from "@mui/material";
import { bcolors } from "../../../colors";
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
import IconPicker from "./components/IconPicker";

function Footer() {
  const { socket } = useContext(SocketContext);
  const { messageData, typeMessage } = useContext(chatboardContext);
  const { userData } = useContext(conversationContext);
  const { authState } = useContext(AuthContext);

  const sendMessage = () => {
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
        width: "100%",
        height: "92px",
        backgroundColor: bcolors.chatboard,
        borderTop: `1px solid ${bcolors.bluedark}`,
        padding: "1.5rem 1rem",
      }}
    >
      <InputText
        text={messageData.message}
        setText={typeMessage}
        onKeyDown={handleKeyDown}
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
