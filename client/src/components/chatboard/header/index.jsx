import { Box, Typography, IconButton } from "@mui/material";
import { bcolors, textcolor } from "../../../colors";
import Avatar from "@mui/material/Avatar";
import { useContext, useState } from "react";
import { conversationContext } from "../../../context";
import { chatboardContext } from "../context";
import { context } from "../../../layout/dashboard/context";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EditGroupDialog from "../components/editDialog";
import LeaveDialog from "../components/leaveDialog";
import LongMenu from "../../menu";

import { useMediaQuery } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function Header() {
  const { userData } = useContext(conversationContext);
  const { chatInfoPopup, setChatInfoPopup } = useContext(context);
  const { handleDialog, setBack, setForward } = useContext(chatboardContext);
  const [leaveDialog, handleLeaveDialog] = useState(false);
  const menuOptions = [
    {
      component: "Edit",
      handle: () => handleDialog(true),
    },
    {
      component: userData.chatInfo.type === "group" ? "Leave" : "Block",
      handle: () => handleLeaveDialog(true),
    },
  ];
  const mobileView = useMediaQuery("(min-width:1000px)");

  return (
    <>
      <EditGroupDialog />
      <LeaveDialog open={leaveDialog} setOpen={handleLeaveDialog} />
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
          {!mobileView && (
            <IconButton onClick={() => setBack(true)}>
              <ArrowBackIosIcon
                sx={{ cursor: "pointer", color: textcolor.white }}
              />
            </IconButton>
          )}
          {userData.chatInfo.avatar ? (
            <Avatar
              src={`${userData.chatInfo.avatar}`}
              alt={`${userData.chatInfo.name}}`}
            />
          ) : (
            <Avatar
              sx={{
                backgroundColor: "#7269ef40",
                color: "rgb(114,105,239)",
                fontSize: ".9375rem",
                fontWeight: 500,
                textTransform: "uppercase",
              }}
            >
              {userData.chatInfo.name ? `${userData.chatInfo.name[0]}` : "N"}
            </Avatar>
          )}
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
          <IconButton onClick={() => {
            if (!mobileView){
              setForward(true);
            }
            setChatInfoPopup(!chatInfoPopup)
            }}>
            <PersonOutlineIcon
              sx={{ cursor: "pointer", color: textcolor.white }}
            />
          </IconButton>
          <LongMenu
            icon={
              <MoreHorizIcon
                sx={{
                  cursor: "pointer",
                  color: textcolor.white,
                }}
              />
            }
            options={menuOptions}
          />
        </Box>
      </Box>
    </>
  );
}

export default Header;
