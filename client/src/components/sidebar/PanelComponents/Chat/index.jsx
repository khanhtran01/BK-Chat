import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import SearchInput from "../../../search";
import { textcolor } from "../../../../colors";
import FriendBox from "../../../friendbox";
import { conversationContext } from "../../../../context";
import { AuthContext } from "../../../../context/authContext";
import { useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
function ChatPanel() {
  const { userData } = useContext(conversationContext);
  const { authState } = useContext(AuthContext);

  const [searchInput, setSearchInput] = useState("");

  const { conversations, onlineList } = userData;
  const [tempConversation, setTemp] = useState([...conversations]);
  useEffect(() => {
    let temp = [];
    if (conversations.length > 0 && authState.user) {
      conversations.forEach((conversation) => {
        if (conversation.type === "single") {
          if (
            conversation.member[0]._id === authState.user._id &&
            conversation.member[1].username
              .toLowerCase()
              .includes(searchInput.toLowerCase())
          ) {
            temp.push(conversation);
          } else if (
            conversation.member[0].username
              .toLowerCase()
              .includes(searchInput.toLowerCase())
          ) {
            temp.push(conversation);
          }
        } else if (
          conversation.name.toLowerCase().includes(searchInput.toLowerCase())
        ) {
          temp.push(conversation);
        }
      });
    }

    if (!authState.user&&  conversations.length > 0){
      setTemp([...conversations])
    }
    else {
      setTemp([...temp]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(conversations), searchInput]);

  return (
    <Box sx={{ height: "100%" }}>
      <Box sx={{ height: "6.75rem", p: 3 }}>
        <Typography
          sx={{
            color: textcolor.primaryGray,
            fontSize: "1.3125rem",
            marginBottom: "1.5rem",
          }}
        >
          Chats
        </Typography>
        <SearchInput value={searchInput} onChange={setSearchInput} />
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
            height: "calc(100vh - 13rem)",
            overflowY: "scroll",
            position: "relative",
            p: 1,
          }}
        >
          {!userData.isLoadingContact && authState.user
            ? tempConversation.map((conversation) => {
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
                  url = conversation.avatar;
                  username = conversation.name;
                }
                return (
                  <FriendBox
                    key={conversation._id}
                    id={conversation._id}
                    url={url}
                    name={username}
                    status={status ? "online" : "offline"}
                    time={conversation.lastChat.createdAt}
                    message={conversation.lastChat.content}
                    type={conversation.type}
                    receiverId={receiverId}
                    numUnRead={conversation.numUnRead}
                    member={conversation.member}
                    desc={conversation.desc}
                  />
                );
              })
            : [0, 0, 0, 0, 0].map(() => (
                <Box
                  key={uuidv4()}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "73px",
                    padding: "15px 20px",
                  }}
                >
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton
                    sx={{ marginLeft: "10px" }}
                    variant="rounded"
                    width={"80%"}
                    height={40}
                  />
                </Box>
              ))}
        </Box>
      </Box>
    </Box>
  );
}

export default ChatPanel;
