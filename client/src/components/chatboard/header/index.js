import { Box, Typography, IconButton } from "@mui/material";
import { bcolors, textcolor } from "../../../colors";
import Avatar from "@mui/material/Avatar";
import { useContext } from "react";
import { conversationContext } from "../../../context";
import { context } from "../../../layout/dashboard/context";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

function Header() {
  const { userData } = useContext(conversationContext);
  const { chatInfoPopup, setChatInfoPopup } = useContext(context);
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
        <Avatar
          sx={{
            textTransform: "uppercase",
          }}
          alt={userData.chatInfo.name ? `${userData.chatInfo.name}` : "None"}
          src={`${userData.chatInfo.avatar}`}
        />
        <Typography
          sx={{
            color: textcolor.primaryGray,
            marginLeft: "1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          {userData.chatInfo.name ? `${userData.chatInfo.name}` : ""}
          {userData.chatInfo.type === "single" && (
            <FiberManualRecordIcon
              sx={{
                fontSize: "15px",
                color: userData.onlineList[userData.chatInfo.receiverId]
                  ? "#44b700"
                  : bcolors.offline,
                marginLeft: "0.6rem",
              }}
            />
          )}
        </Typography>
      </Box>
      <Box sx={{ color: "white", display: "flex", alignItems: "center" }}>
        <IconButton>
          <SearchIcon
            sx={{
              cursor: "pointer",
              color: textcolor.white,
            }}
          />
        </IconButton>
        <IconButton onClick={() => setChatInfoPopup(!chatInfoPopup)}>
          <PersonOutlineIcon
            sx={{ cursor: "pointer", color: textcolor.white }}
          />
        </IconButton>
        <IconButton>
          <MoreHorizIcon
            sx={{
              cursor: "pointer",
              color: textcolor.white,
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Header;
