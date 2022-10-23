import { Box, Typography } from "@mui/material";
import { bcolors, textcolor } from "../../../colors";
import Avatar from "@mui/material/Avatar";
import { useContext } from "react";
import { conversationContext } from "../../../context";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

function Header() {
  const { userData } = useContext(conversationContext);
  return (
    <Box
      sx={{
        backgroundColor: bcolors.chatboard,
        height: "5.5rem",
        padding: "24px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar alt={`${userData.chatInfo.name}`} src={`${userData.chatInfo.avatar}`} />
        <Typography
          sx={{
            color: textcolor.primaryGray,
            marginLeft: "1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          {`${userData.chatInfo.name}`}
          <FiberManualRecordIcon
            sx={{
              fontSize: "15px",
              color: userData.onlineList[userData.chatInfo.receiverId] ?  "#44b700" : bcolors.offline,
              marginLeft: "0.6rem",
            }}
          />
        </Typography>
      </Box>
      <Box sx={{ color: "white", display: "flex", alignItems: "center" }}>
        <SearchIcon sx={{ marginLeft: "1rem", cursor: "pointer" }} />
        <PersonOutlineIcon sx={{ marginLeft: "1rem", cursor: "pointer" }} />
        <MoreHorizIcon sx={{ marginLeft: "1rem", cursor: "pointer" }} />
      </Box>
    </Box>
  );
}

export default Header;
