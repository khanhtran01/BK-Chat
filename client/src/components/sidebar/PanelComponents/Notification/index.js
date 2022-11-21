import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useContext, useState } from "react";
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
  });

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Box sx={{ height: "100%" }}>
      {/* <Box sx={{ height: "10rem", p: 3 }}>
        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
          marginBottom="1.5rem"
        >
          <Typography
            sx={{
              color: textcolor.primaryGray,
              fontSize: "1.3125rem",
            }}
          >
            Groups
          </Typography>
          <Button
            sx={{
              color: textcolor.primaryGray,
            }}
            onClick={() => handleCreateGroup(true)}
          >
            <GroupIcon />
          </Button>
        </Box>
        <SearchInput placeholder={"Search groups..."} />
      </Box> */}
      <NotifyDialog
        conversationId={dialogData.conversationId}
        members={dialogData.members}
        open={openDialog}
        setOpenDialog={setOpenDialog}
        notifyId={dialogData.notifyId}
      />
      <Box pt={3} px={3}>
        <Typography
          sx={{
            color: textcolor.primaryGray,
            fontSize: "1.3125rem",
          }}
        >
          Notifications
        </Typography>
      </Box>
      <Box
        sx={{
          overflow: "scroll",
          height: "calc(100vh - 40px)",
          padding: "24px",
        }}
      >
        {userData.notifyList.map((e) => (
          <NotificationElement
            key={uuidv4()}
            notifyId={e._id}
            conversationId={e.conversationId}
            members={e.members}
            setDialogData={setDialogData}
            setOpenDialog={setOpenDialog}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Notification;
