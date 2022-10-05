import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchInput from "../../../search";
import { textcolor } from "../../../../colors";
import ActivateList from "../../../activateList";
import FriendBox from "../../../friendbox";
// import { useContext } from "react";
// import Context from "../../../../context";
import { v4 as uuidv4 } from "uuid";
import { clientList } from "./data";
function ChatPanel() {
  // const [client, setClient] = useContext(Context);
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
          {clientList.map((friend) => (
            <FriendBox
              key={uuidv4()}
              id={friend.id}
              url={friend.img}
              // selected={friend.id === client}
              // setSelected={setClient}
              status={friend.status}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default ChatPanel;
