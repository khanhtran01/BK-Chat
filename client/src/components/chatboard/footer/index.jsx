import React, { useContext, useEffect } from "react";

// Mui import
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Box, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import Fade from "@mui/material/Fade";

// import Context
import { messageContext } from "../context/messageContext";
import { AuthContext } from "../../../context/authContext";
import { SocketContext } from "../../../context/socket";
import { conversationContext } from "../../../context";
import { replyContext } from "../context/replyContext";
// import component
import InputText from "../../typemessage";
// import BtnIcon from "../../btnIcon";
import TagList from "./components/TagList";
import IconPicker from "./components/IconPicker";
// import material and function
import { bcolors, textcolor } from "../../../colors";
import moment from "moment";
// import moment from 'moment-timezone';
// import moment from "mo"

function Footer() {
  const { socket } = useContext(SocketContext);
  const {message, typeMessage, clearTags } = useContext(messageContext);
  const { userData : {chatInfo, currConversationId}, add_message_fast } = useContext(conversationContext);
  const { authState : { user }} = useContext(AuthContext);
  const {replyFor,setReply} = useContext(replyContext)
  
  useEffect(() => {
    typeMessage("")
    clearTags()
    setReply("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currConversationId])


  const sendMessage = () => {
    if (message.message === "") {
      return;
    }
    const tagList = [];
    chatInfo.member.forEach((mem) => {
      if (message.message.includes("@" + mem.username)) {
        tagList.push(mem._id);
      }
    });
    let currTime = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    if (chatInfo.type === "single") {
      socket.emit("sendChatSingle", {
        receiverId: chatInfo.receiverId,
        content: message.message,
        time: currTime,
        replyFromChatId: replyFor ? replyFor._id : null,
        sender: user,
        conversationId: currConversationId,
        tagList: tagList,
      });
      add_message_fast({
        content: message.message,
        conversationId: currConversationId,
        createdAt: currTime,
        replyFrom: replyFor ? replyFor : null,
        userId: user,
        _id: currTime,
        verify: false,
      });
    } else {
      socket.emit("sendChatGroup", {
        content: message.message,
        time: currTime,
        replyFromChatId: replyFor ? replyFor._id : null,
        sender: user,
        conversationId: currConversationId,
        tagList: tagList,
      });

      add_message_fast({
        content: message.message,
        conversationId: currConversationId,
        createdAt: currTime,
        replyFrom: replyFor ? replyFor : null,
        userId: user,
        _id: currTime,
        verify: false,
      });
    }
    typeMessage("");
    setReply("");
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
        zIndex: 2,
      }}
    >
      {/* {replyFor && ( */}
      <Fade
        direction="up"
        in={message ? (replyFor ? true : false) : false}
      >
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
                Reply to{" "}
                <strong>
                  {replyFor
                    ? replyFor.userId.username
                    : ""}
                </strong>
                :
              </Typography>
              <Typography
                fontSize={"13px"}
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {replyFor.content}
              </Typography>
            </Box>
            <div onClick={() => setReply("")}>
              <ClearIcon sx={{ color: textcolor.primaryGray }} />
            </div>
          </Box>
        </Box>
      </Fade>
      {message.tagList && message.tagList.length !== 0 && <TagList />}

      <InputText
        text={message.message}
        setText={typeMessage}
        onKeyDown={handleKeyDown}
        disabled={currConversationId === ""}
      />
      <IconPicker />

      {/* <BtnIcon icon={<AttachFileIcon sx={{ color: bcolors.main }} />} /> */}
      <Button
        sx={{
          width: "3rem",
          backgroundColor: bcolors.main,
          "&.MuiButton-root:hover": {
            backgroundColor: bcolors.secondary,
          },
        }}
        disabled={currConversationId === ""}
        variant="contained"
        onClick={sendMessage}
      >
        <SendIcon />
      </Button>
    </Box>
  );
}

export default Footer;
