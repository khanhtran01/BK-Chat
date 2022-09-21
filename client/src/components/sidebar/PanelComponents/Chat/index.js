import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchInput from "../../../search";
import { textcolor } from "../../../../colors";
import ActivateList from "../../../activateList";
function ChatPanel() {
  return (
    <Box>
      <Box>
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
        <ActivateList />
        <Typography
          sx={{
            color: textcolor.primaryGray,
            fontSize: "1.3125rem",
            marginBottom: "1.5rem",
          }}
        >
          Recents
        </Typography>
      </Box>
      <Box></Box>
    </Box>
  );
}

export default ChatPanel;
