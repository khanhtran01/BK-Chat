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
import ClearIcon from "@mui/icons-material/Clear";
import BtnIcon from "../../btnIcon";
// import MessageInput from "./components/MessageInput";
import TagList from "./components/TagList";
import IconPicker from "./components/IconPicker";

function Footer() {
  const { socket } = useContext(SocketContext);
  const { messageData, typeMessage, clearReply } = useContext(chatboardContext);
  const { userData } = useContext(conversationContext);
  const { authState } = useContext(AuthContext);
  const sendMessage = () => {
    const tagList = [];
    // eslint-disable-next-line array-callback-return
    userData.chatInfo.member.map(mem => {
      if (messageData.message.includes('@'+ mem.username)){
        tagList.push(mem._id);
      }
    })
    console.log(tagList);

    if (userData.chatInfo.type === "single") {
      socket.emit("sendChatSingle", {
        receiverId: userData.chatInfo.receiverId,
        content: messageData.message,
        time: moment(),
        replyFromChatId: messageData.replyFor ? messageData.replyFor._id : null,
        sender: authState.user,
        conversationId: userData.currConversationId,
        tagList: tagList,
      });
    } else {
      socket.emit("sendChatGroup", {
        content: messageData.message,
        time: moment(),
        replyFromChatId: messageData.replyFor ? messageData.replyFor._id : null,
        sender: authState.user,
        conversationId: userData.currConversationId,
        tagList: tagList,
      });
    }
    typeMessage("");
    clearReply();
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
            backgroundColor: bcolors.reply,
            // justifyContent: "space-between",
            width: "100%",
            top: "-50px",
            height: "60px",
            left: 0,
            paddingLeft: "1rem",
            paddingY: "0.2rem",
            // borderRadius: "1rem",
          }}
        >
          <Box
            width="99%"
            display="flex"
            height={"100%"}
            justifyContent="space-between"
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              width="96%"
              sx={{ color: textcolor.primaryGray, fontSize: "5px" }}
            >
              <Typography fontSize={"14px"}>
                Reply to <strong>{messageData.replyFor.userId.username}</strong>
                :
              </Typography>
              <Typography
                fontSize={"13px"}
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {messageData.replyFor.content}
              </Typography>
            </Box>
            <div onClick={clearReply}>
              <ClearIcon sx={{ color: textcolor.primaryGray }} />
            </div>
          </Box>
        </Box>
      )}
      
      <TagList />
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
