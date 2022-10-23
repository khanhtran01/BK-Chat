import { Box } from "@mui/material";
import { bcolors } from "../../../colors";
import { AuthContext } from "../../../context/authContext";
import { conversationContext } from "../../../context";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import MyMessage from "../../mymessage";
import FriendMessage from "../../friendmessage";

function Body() {
  const { userData } = useContext(conversationContext);
  const { authState } = useContext(AuthContext);
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
                time={message.createdAt}
              />
            );
          }
          return (
            <FriendMessage
              key={uuidv4()}
              message={message.content}
              time={message.createdAt}
              username={message.userId.username}
              avatar={message.userId.avatar}
            />
          );
        })}
    </Box>
  );
}

export default Body;
