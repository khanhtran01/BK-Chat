import { Box, Typography, IconButton } from "@mui/material";
import { bcolors, textcolor } from "../../../colors";
import Avatar from "@mui/material/Avatar";
import { useContext, useState, memo } from "react";
import { conversationContext } from "../../../context";
import { chatboardContext } from "../context";
import { context } from "../../../layout/dashboard/context";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EditGroupDialog from "../components/editDialog";
import LeaveDialog from "../components/leaveDialog";
import LongMenu from "../../menu";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import BlockIcon from "@mui/icons-material/Block";
import { useMediaQuery } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddMemberDialog from "../components/addMemberDialog";
import SelectContextProvider from "../context/addMemberContext";
function Header() {
  const { userData } = useContext(conversationContext);
  const { chatInfoPopup, setChatInfoPopup } = useContext(context);
  const { handleDialog, setBack } = useContext(chatboardContext);
  const [leaveDialog, handleLeaveDialog] = useState(false);
  const [addMemberDialogStatus, setAddMemberDialogStatus] = useState(false);
  const menuOptions = [
    {
      component: (
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography>Edit</Typography>
          <EditIcon sx={{ fontSize: "18px" }} />
        </Box>
      ),
      handle: () => handleDialog(true),
    },
    {
      component: (
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography>Add Member</Typography>
          <GroupAddIcon sx={{ fontSize: "18px" }} />
        </Box>
      ),
      handle: () => setAddMemberDialogStatus(true),
    },
    {
      component: (
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography>Leave</Typography>
          <LogoutIcon sx={{ fontSize: "18px" }} />
        </Box>
      ),
      handle: () => handleLeaveDialog(true),
    },
  ];
  const menuOptions2 = [
    {
      component: (
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography>Block</Typography>
          <BlockIcon sx={{ fontSize: "18px" }} />
        </Box>
      ),
      handle: () => { },
    },
  ];
  const mobileView = useMediaQuery("(min-width:1000px)");
  return (
    <>
      <EditGroupDialog initData={userData.chatInfo} />

      <LeaveDialog open={leaveDialog} setOpen={handleLeaveDialog} />
      <SelectContextProvider>
        <AddMemberDialog
          open={addMemberDialogStatus}
          setOpen={setAddMemberDialogStatus}
        />
      </SelectContextProvider>
      <Box
        sx={{
          backgroundColor: bcolors.chatboard,
          height: "5.5rem",
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          zIndex: 3,
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
          {/* <IconButton>
            <SearchIcon
              sx={{
                cursor: "pointer",
                color: textcolor.white,
              }}
            />
          </IconButton> */}
          <IconButton
            onClick={() => {
              setChatInfoPopup(!chatInfoPopup);
            }}
          >
            <PersonOutlineIcon
              sx={{ cursor: "pointer", color: textcolor.white }}
            />
          </IconButton>
          {
            userData.chatInfo.type === "group" && <LongMenu
            icon={
              <MoreHorizIcon
                sx={{
                  cursor: "pointer",
                  color: textcolor.white,
                }}
              />
            }
            options={
              userData.chatInfo.type === "group" ? menuOptions : menuOptions2
            }
          />
          }
        </Box>
      </Box>
    </>
  );
}

export default memo(Header);
