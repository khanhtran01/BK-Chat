import { Box, Typography } from "@mui/material";
import { bcolors, textcolor } from "../../../colors";
import Avatar from "@mui/material/Avatar";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

function Header(props) {
  return (
    <Box
      sx={{
        backgroundColor: bcolors.chatboard,
        height: "5.5rem",
        padding: "24px",
        display: "flex",
        justifyContent: "space-between",
        // justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        <Typography
          sx={{
            color: textcolor.primaryGray,
            marginLeft: "1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          Remy Sharp
          <FiberManualRecordIcon
            sx={{
              fontSize: "15px",
              color: "#44b700",
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
