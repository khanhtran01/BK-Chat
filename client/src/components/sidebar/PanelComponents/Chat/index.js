import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchInput from "../../../search";
import { textcolor } from "../../../../colors";
import ActivateList from "../../../activateList";
import FriendBox from "../../../friendbox";
import { AuthContext } from "../../../../context/authContext";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { clientList } from "./data";
function ChatPanel() {
  const {
    authState,
  } = useContext(AuthContext);
  const { conversations} = authState;
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
          {
          conversations &&
          conversations.map((conversation) => {
            let url, username;
            if (conversation.type === "single") {

              url = conversation.member[0]._id === authState.user._id ? conversation.member[1].avatar : conversation.member[0].avatar;
              username = conversation.member[0]._id === authState.user._id ? conversation.member[1].username : conversation.member[0].username;
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
                status={"online"}
                time={conversation.updatedAt}
                message={conversation.lastChat.content}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default ChatPanel;
