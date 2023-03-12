import { Box } from "@mui/material";
import { bcolors } from "../../../colors";
import { AuthContext } from "../../../context/authContext";
import { conversationContext } from "../../../context";
import { useContext, useMemo, memo } from "react";
import { v4 as uuidv4 } from "uuid";
import CircularProgress from "@mui/material/CircularProgress";
import MyMessage from "../../mymessage";
import FriendMessage from "../../friendmessage";
import moment from "moment";

function Body() {
  const { userData } = useContext(conversationContext);
  const { authState } = useContext(AuthContext);
  const handleTime = (time) => {
    const today = moment();
    if (today.date() === moment(time).date()) {
      return moment.utc(time).format("HH:mm");
    } else {
      return moment.utc(time).format("HH:mm DD/MM/YYYY");
    }
  };
  const memList = useMemo(() => {
    let temp = [];
    if (userData.chatInfo.member) {
      userData.chatInfo.member.map((mem) => {
        temp.push("@" + mem.username);
      });
    }
    return temp;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {!userData.isLoadingConversation ? (
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
  );
}

export default memo(Body);
