import { Box, Typography } from "@mui/material";
import { bcolors, textcolor } from "../../../colors";
import MyMessage from "../../mymessage";
import FriendMessage from "../../friendmessage";
function Body(props) {
  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        height: "calc(100vh - 180px)",
        backgroundColor: bcolors.chatboard,
        borderTop: `1px solid ${bcolors.bluedark}`,
        padding: "24px",
        overflowY: "scroll",
      }}
    >
      <MyMessage message="Hello World!!" />
      <FriendMessage message="Hello World!!" time="10:12" />
    </Box>
  );
}

export default Body;
