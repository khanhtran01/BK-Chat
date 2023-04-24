import React from "react";
import { Button, Box, Typography, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { textcolor, bcolors } from "../../../../../../colors";
import moment from "moment";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
  type,
  time
}) {
  const convertTime = (time) => {
    let today = new Date();
    if (moment(today).date() === moment(time).date()) {
      return moment(time).format("HH:mm");
    } else {
      return moment(time).format("DD/MM");
    }
  };
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
      sx={{
        height: 'fit-content'
      }}
    >
      <Box display="flex" alignItems={'center'}>
        {conversationId && conversationId.avatar ? (
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
          >{`${conversationId ? conversationId.name[0] : 'N'}`}</Avatar>
        )}

        <Box ml={2}>
          <Typography fontSize={"14px"} textAlign="left">
            {
              type === "single" ? `Suggest to create a group about ${topic}` : `The system proposes to create a subgroup from group ${conversationId.name}`
            }
          </Typography>
          <Box display={"flex"} alignItems={"center"}>
            <AccessTimeIcon sx={{ width: '12px', height: '12px', marginRight: '5px' }} />
            <Typography fontSize={"12px"} textAlign="left" fontWeight={500} display={"flex"} alignItems={'center'} mt={'4px'}>
              {convertTime(time)}
            </Typography>
          </Box>

        </Box>
      </Box>
    </CustomButton>
  );
}

export default NotificationElement;
