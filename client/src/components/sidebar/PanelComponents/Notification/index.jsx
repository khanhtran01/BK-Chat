import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useContext, useState } from "react";
import { Box, Typography } from "@mui/material";

import NotificationElement from "./components/NotificationElement";
import NotifyDialog from "./components/NotifyDialog";

import { textcolor } from "../../../../colors";
import { conversationContext } from "../../../../context";

// 586612722aaa@gmail.com
function Notification() {
  const { userData } = useContext(conversationContext);
  const [dialogData, setDialogData] = useState({
    conversationId: "",
    members: [],
    notifyId: "",
    topic: "",
    confidence: "",
    type: "",
    time: "",
  });
  console.log(userData.notifyList);
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <Box sx={{ height: "100%" }}>
      <NotifyDialog
        conversationId={dialogData.conversationId}
        members={dialogData.members}
        open={openDialog}
        setOpenDialog={setOpenDialog}
        notifyId={dialogData.notifyId}
        topic={dialogData.topic}
        confidence={dialogData.confidence}
        type={dialogData.type}
        time={dialogData.time}
      />
      <Box pt={3} px={3}>
        <Typography
          sx={{
            color: textcolor.primaryGray,
            fontSize: "1.3125rem",
          }}
        >
          Suggestions
        </Typography>
      </Box>
      <Box
        sx={{
          overflow: "scroll",
          height: "calc(100vh - 60px)",
          padding: "24px",
        }}
      >
        {userData.notifyList && userData.notifyList.map((e) => (
          <NotificationElement
            key={uuidv4()}
            notifyId={e._id}
            conversationId={e.conversationId}
            members={e.member}
            setDialogData={setDialogData}
            setOpenDialog={setOpenDialog}
            confidence={e.confidence}
            topic={e.topic}
            type={e.type}
            time={e.createdAt}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Notification;
