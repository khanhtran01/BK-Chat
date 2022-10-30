import { Box } from "@mui/material";
import { bcolors } from "../../../colors";
import { AuthContext } from "../../../context/authContext";
import { conversationContext } from "../../../context";
import { useContext, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import MyMessage from "../../mymessage";
import FriendMessage from "../../friendmessage";
import moment from "moment";

function Body() {
  const { userData } = useContext(conversationContext);
  const { authState } = useContext(AuthContext);

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
    userData.chatInfo.member.map((mem) => {
      temp.push("@" + mem.username);
    });
    console.log(temp);
    return temp;
  }, [JSON.stringify(userData.chatInfo.member)]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column-reverse",
        height: "calc(100vh - 180px)",
        backgroundColor: bcolors.chatboard,
        borderTop: `1px solid ${bcolors.bluedark}`,
        padding: "24px",
        overflowY: "scroll",
      }}
    >
      {[]
        .concat(userData && userData.currConversation)
        .reverse()
        .map((message) => {
          if (message.userId._id === authState.user._id) {
            return (
              <MyMessage
                key={uuidv4()}
                message={message.content}
                time={handleTime(message.createdAt)}
                messageInfo={message}
                replyFrom={message.replyFrom}
                memList={memList}
              />
            );
          }
          return (
            <FriendMessage
              key={uuidv4()}
              message={message.content}
              time={handleTime(message.createdAt)}
              username={message.userId.username}
              avatar={message.userId.avatar}
              replyFrom={message.replyFrom}
              messageInfo={message}
              memList={memList}
            />
          );
        })}
    </Box>
  );
}

export default Body;
