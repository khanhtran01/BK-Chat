import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchInput from "../../../search";
import { textcolor } from "../../../../colors";
import ActivateList from "../../../activateList";
import FriendBox from "../../../friendbox";
import { conversationContext } from "../../../../context";
import { AuthContext } from "../../../../context/authContext";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { clientList } from "./data";
function ChatPanel() {
  const { userData } = useContext(conversationContext);
  const { authState } = useContext(AuthContext);
  const { conversations, onlineList } = userData;
  console.log(conversations);
  return (
    <Box sx={{ height: "100%" }}>
      <Box sx={{ height: "13.75rem", p: 3 }}>
        <Typography
          sx={{
            color: textcolor.primaryGray,
            fontSize: "1.3125rem",
            marginBottom: "1.5rem",
          }}
        >
          Chats
        </Typography>
        <SearchInput />
        <ActivateList data={clientList} />
      </Box>
      <Box>
        <Typography
          sx={{
            color: textcolor.primaryGray,
            fontSize: "1.3125rem",
            marginTop: "1.5rem",
            p: 3,
            marginBottom: "-1rem",
          }}
        >
          Recents
        </Typography>
        <Box
          sx={{
            height: "calc(100vh - 20rem)",
            overflowY: "scroll",
            position: "relative",
            p: 1,
          }}
        >
          {conversations &&
            conversations.map((conversation) => {
              let url, username, status, receiverId;
              if (conversation.type === "single") {
                if (conversation.member[0]._id === authState.user._id) {
                  url = conversation.member[1].avatar;
                  username = conversation.member[1].username;
                  status = onlineList[conversation.member[1]._id];
                  receiverId = conversation.member[1]._id;
                } else {
                  url = conversation.member[0].avatar;
                  username = conversation.member[0].username;
                  status = onlineList[conversation.member[0]._id];
                  receiverId = conversation.member[0]._id;
                }
              } else {
                url = conversation.member[0].avatar;
                username = conversation.name;
              }
              return (
                <FriendBox
                  key={uuidv4()}
                  id={conversation._id}
                  url={url}
                  name={username}
                  status={status ? "online" : "offline"}
                  time={conversation.updatedAt}
                  message={conversation.lastChat.content}
                  type={conversation.type}
                  receiverId={receiverId}
                  numUnRead={conversation.numUnRead}
                />
              );
            })}
        </Box>
      </Box>
    </Box>
  );
}

export default ChatPanel;
