import { Box, IconButton } from "@mui/material";
import { bcolors } from "../../../colors";
import { AuthContext } from "../../../context/authContext";
import { conversationContext } from "../../../context";
import { chatboardContext } from "../context";
import { useContext, useMemo, memo, useState, useRef, useEffect } from "react";
import Slide from "@mui/material/Slide";
import { v4 as uuidv4 } from "uuid";
import CircularProgress from "@mui/material/CircularProgress";
import MyMessage from "../../mymessage";
import FriendMessage from "../../friendmessage";
import moment from "moment";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";

function Body() {
  const [scrollButton, setScrollButton] = useState({
    top: false,
    bot: false,
  });
  const { userData, updateOldMessages } = useContext(conversationContext);
  const { authState } = useContext(AuthContext);
  const { handleLoadMessagePaging } = useContext(chatboardContext);
  const handleLoadMessage = async () => {
    const old_message = await handleLoadMessagePaging(userData.currConversation[0].conversationId,userData.currConversation[0]._id)
    if (old_message !== []){
      updateOldMessages(old_message);
    }
  };
  useEffect(() => {
    setScrollButton({
      top: false,
      bot: false,
    });
  }, [userData.currConversationId]);
  const bodyInfo = useRef();
  const handleScroll = (event) => {
    if (
      event.target.scrollTop <
        -(bodyInfo.current.scrollHeight - bodyInfo.current.clientHeight) + 10 &&
      scrollButton.top === false
    ) {
      setScrollButton({
        ...scrollButton,
        top: true,
      });
    }
    if (event.target.scrollTop < -400 && scrollButton.bot === false) {
      setScrollButton({
        ...scrollButton,
        bot: true,
      });
    }
    if (
      event.target.scrollTop >
        -(bodyInfo.current.scrollHeight - bodyInfo.current.clientHeight) + 10 &&
      scrollButton.top === true
    ) {
      setScrollButton({
        ...scrollButton,
        top: false,
      });
    }

    if (event.target.scrollTop > -400 && scrollButton.bot === true) {
      setScrollButton({
        ...scrollButton,
        bot: false,
      });
    }
  };
  const handleTime = (time) => {
    const today = moment();
    if (today.date() === moment(time).date()) {
      return moment(time).format("HH:mm");
    } else {
      return moment(time).format("HH:mm DD/MM/YYYY");
    }
  };
  const memList = useMemo(() => {
    let temp = [];
    if (userData.chatInfo.member) {
      userData.chatInfo.member.forEach((mem) => {
        temp.push("@" + mem.username);
      });
    }
    return temp;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(userData.chatInfo.member)]);

  const handleScrollToBottom = () => {
    bodyInfo.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Slide
        direction="down"
        in={scrollButton.top}
        container={bodyInfo.current}
      >
        <IconButton
          sx={{
            zIndex: 1,
            position: "absolute",
            top: "10px",
            right: "50%",
            backgroundColor: "#7269efa0",
            ":hover": {
              backgroundColor: bcolors.main,
            },
          }}
          onClick={handleLoadMessage}
        >
          <KeyboardDoubleArrowUpIcon />
        </IconButton>
      </Slide>

      <Slide direction="up" in={scrollButton.bot} container={bodyInfo.current}>
        <IconButton
          sx={{
            zIndex: 1,
            position: "absolute",
            bottom: "10px",
            right: "50%",
            backgroundColor: "#7269efa0",
            ":hover": {
              backgroundColor: bcolors.main,
            },
          }}
          onClick={handleScrollToBottom}
        >
          <KeyboardDoubleArrowDownIcon />
        </IconButton>
      </Slide>

      <Box
        onScroll={handleScroll}
        ref={bodyInfo}
        sx={{
          display: "flex",
          flex: 1,
          width: "100%",
          flexDirection: "column-reverse",
          height: "calc(100vh - 180px)",
          backgroundColor: bcolors.chatboard,
          borderTop: `1px solid ${bcolors.bluedark}`,
          padding: "24px",
          overflowY: "scroll",
          position: "relative",
        }}
      >
        {/* <Slide direction="up" in={scrollButton.top} container={bodyInfo.current}> */}

        {/* </Slide> */}
        {!userData.isLoadingConversation && authState.user ? (
          []
            .concat(userData && userData.currConversation)
            .reverse()
            .map((message) => {
              if (message.userId._id === authState.user._id) {
                return (
                  <MyMessage
                    key={message._id}
                    message={message.content}
                    time={handleTime(message.createdAt)}
                    messageInfo={message}
                    replyFrom={message.replyFrom}
                    memList={memList}
                    verify={message.verify}
                  />
                );
              }
              return (
                <FriendMessage
                  key={message._id}
                  message={message.content}
                  time={handleTime(message.createdAt)}
                  username={message.userId.username}
                  avatar={message.userId.avatar}
                  replyFrom={message.replyFrom}
                  messageInfo={message}
                  memList={memList}
                />
              );
            })
        ) : (
          <Box
            key={uuidv4()}
            display="flex"
            width={"100%"}
            height={"100%"}
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress sx={{ color: bcolors.main }} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default memo(Body);
