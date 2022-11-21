import React from "react";
import { Button, Box, Typography, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { textcolor, bcolors } from "../../../../../../colors";
const CustomButton = styled(Button)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  width: "100%",
  height: "73px",
  padding: "15px 20px",
  color: textcolor.white,
  textTransform: "capitalize",
  backgroundColor: bcolors.sidebar,
  marginBottom: "5px",
  "&:focus": {
    backgroundColor: "none",
  },
});

function NotificationElement({conversationId, members, setDialogData, setOpenDialog, notifyId}) {
  return (
    <CustomButton
      onClick={
        () => {
          setDialogData({
            conversationId: conversationId,
            members: members,
            notifyId: notifyId,
          });
          setOpenDialog(true);
        }
      }
    >
      <Box display="flex">
        <Avatar
          src={`${conversationId.avatar}`}
          alt="System"
        ></Avatar>
        <Box ml={2}>
          <Typography fontSize={"14px"} textAlign="left">The system proposes to create a subgroup from group {`${conversationId.name}`}</Typography>
        </Box>
      </Box>
    </CustomButton>
  );
}

export default NotificationElement;
