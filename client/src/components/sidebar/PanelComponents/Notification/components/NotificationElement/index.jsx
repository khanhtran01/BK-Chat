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
  textTransform: "inherit",
  backgroundColor: bcolors.sidebar,
  marginBottom: "5px",
  "&:focus": {
    backgroundColor: "none",
  },
});

function NotificationElement({
  conversationId,
  members,
  setDialogData,
  setOpenDialog,
  notifyId,
  topic,
  confidence,
  type
}) {
  return (
    <CustomButton
      onClick={() => {
        setDialogData({
          conversationId: conversationId,
          members: members,
          notifyId: notifyId,
          topic: topic,
          confidence: confidence,
          type: type
        });
        setOpenDialog(true);
      }}
    >
      <Box display="flex">
        {conversationId.avatar ? (
          <Avatar
            src={`${conversationId.avatar}`}
            alt={`${conversationId.name}`}
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
          >{`${conversationId.name[0]}`}</Avatar>
        )}

        <Box ml={2}>
          <Typography fontSize={"14px"} textAlign="left">
            {
              type === "single" ? `The system suggests you create a new group on the topic ${topic}` : `The system proposes to create a subgroup from group ${conversationId.name}`
            }
          </Typography>
        </Box>
      </Box>
    </CustomButton>
  );
}

export default NotificationElement;
