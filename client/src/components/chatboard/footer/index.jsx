import React, { useContext, memo } from "react";

// Mui import
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Box, Typography, unstable_createMuiStrictModeTheme } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import Fade from "@mui/material/Fade";

// import Context
import { chatboardContext } from "../context";
import { AuthContext } from "../../../context/authContext";
import { SocketContext } from "../../../context/socket";
import { conversationContext } from "../../../context";
// import component
import InputText from "../../typemessage";
import BtnIcon from "../../btnIcon";
import TagList from "./components/TagList";
import IconPicker from "./components/IconPicker";
// import material and function
import { bcolors, textcolor } from "../../../colors";
import moment from "moment";

function Footer() {
  const { socket } = useContext(SocketContext);
  const { messageData, typeMessage, clearReply } = useContext(chatboardContext);
  const { userData : {chatInfo, currConversationId}, add_message_fast } = useContext(conversationContext);
  const { authState : { user }} = useContext(AuthContext);

  const sendMessage = () => {
    const tagList = [];
    // eslint-disable-next-line array-callback-return
    chatInfo.member.map((mem) => {
      if (messageData.message.includes("@" + mem.username)) {
        tagList.push(mem._id);
      }
    });
    let currTime = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    if (chatInfo.type === "single") {
      let currTime = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      socket.emit("sendChatSingle", {
        receiverId: chatInfo.receiverId,
        content: messageData.message,
        time: currTime,
        replyFromChatId: messageData.replyFor ? messageData.replyFor._id : null,
        sender: user,
        conversationId: currConversationId,
        tagList: tagList,
      });
      add_message_fast({
        content: messageData.message,
        conversationId: currConversationId,
        createdAt: currTime,
        replyFrom: messageData.replyFor ? messageData.replyFor : null,
        userId: user,
        _id: currTime,
        verify: false,
      });
    } else {
      socket.emit("sendChatGroup", {
        content: messageData.message,
        time: moment(),
        replyFromChatId: messageData.replyFor ? messageData.replyFor._id : null,
        sender: user,
        conversationId: currConversationId,
        tagList: tagList,
      });

      add_message_fast({
        content: messageData.message,
        conversationId: currConversationId,
        createdAt: currTime,
        replyFrom: messageData.replyFor ? messageData.replyFor : null,
        userId: user,
        _id: currTime,
        verify: false,
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
      {/* {messageData.replyFor && ( */}
      <Fade
        direction="up"
        in={messageData ? (messageData.replyFor ? true : false) : false}
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
                  {messageData.replyFor
                    ? messageData.replyFor.userId.username
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
                {messageData.replyFor.content}
              </Typography>
            </Box>
            <div onClick={clearReply}>
              <ClearIcon sx={{ color: textcolor.primaryGray }} />
            </div>
          </Box>
        </Box>
      </Fade>
      {messageData.tagList && messageData.tagList.length !== 0 && <TagList />}

      <InputText
        text={messageData.message}
        setText={typeMessage}
        onKeyDown={handleKeyDown}
        disabled={currConversationId === ""}
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
        disabled={currConversationId === ""}
        variant="contained"
        onClick={sendMessage}
      >
        <SendIcon />
      </Button>
    </Box>
  );
}

export default memo(Footer);
