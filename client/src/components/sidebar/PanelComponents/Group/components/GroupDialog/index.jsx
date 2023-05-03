import * as React from "react";
import { useContext, useState } from "react";

// MUI import
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import { Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";


import { bcolors, textcolor } from "../../../../../../colors";

import { SocketContext } from "../../../../../../context/socket";
import { conversationContext } from "../../../../../../context";
import { groupsContext } from "../../context";
import { AuthContext } from "../../../../../../context/authContext";

import SelectButton from "./components/SelectButton";
import ListMember from "./components/ListMember";
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function GroupDialog() {
  const {
    groupData,
    handleCreateGroup,
    openSelectPopup,
    handleGroupName,
    handleDescription,
    handleFirstMessage,
  } = useContext(groupsContext);
  const { createGroup } = useContext(conversationContext);
  const { socket } = useContext(SocketContext);
  const { authState: {
    user
  } } = useContext(AuthContext);
  const [alertStatus, setAlertStatus] = useState({
    open: false,
    message: "",
    type: "error",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertStatus({
      ...alertStatus,
      open: false,
    });
  };

  return (
    <div>
      <Snackbar
        open={alertStatus.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertStatus.type}
          sx={{ width: "100%" }}
        >
          {alertStatus.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={groupData.groupDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleCreateGroup(false)}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: bcolors.dialog,
            width: "90%",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: textcolor.primaryGray,
          }}
        >
          {"Create New Group"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection={"column"} width="100%">
            <Typography
              sx={{
                paddingTop: "8px",
                paddingBottom: "5px",
                color: textcolor.white,
              }}
            >
              Group Name
            </Typography>
            <TextField
              sx={{
                ".MuiInputBase-root": {
                  color: "white",
                },
              }}
              value={groupData.groupName}
              onChange={handleGroupName}
              name="name"
              hiddenLabel
              placeholder="Enter Group Name"
            />

            <Typography
              sx={{
                paddingTop: "12px",
                paddingBottom: "5px",
                color: textcolor.white,
              }}
            >
              Group Members
            </Typography>
            <Box>
              <ListMember />
              <Box
                sx={{
                  width: "10rem",
                }}
              >
                <SelectButton onClick={openSelectPopup}>
                  Select members
                </SelectButton>
              </Box>
            </Box>

            <Typography
              sx={{
                paddingTop: "12px",
                paddingBottom: "5px",
                color: textcolor.white,
              }}
            >
              Description
            </Typography>
            <TextField
              sx={{
                ".MuiInputBase-root": {
                  color: "white",
                },
              }}
              value={groupData.description}
              onChange={handleDescription}
              name="description"
              multiline
              hiddenLabel
              placeholder="Enter Description"
            />
            <Typography
              sx={{
                paddingTop: "12px",
                paddingBottom: "5px",
                color: textcolor.white,
              }}
            >
              First Message
            </Typography>
            <TextField
              sx={{
                ".MuiInputBase-root": {
                  color: "white",
                },
              }}
              value={groupData.firstMessage}
              onChange={handleFirstMessage}
              name="description"
              multiline
              hiddenLabel
              placeholder="Enter Description"
            />
          </Box>
          <DialogActions>
            <Button
              onClick={() => {
                handleCreateGroup(false);
              }}
              variant="outlined"
            >
              Close
            </Button>
            <Button
              onClick={async () => {
                handleCreateGroup(false);
                setIsSubmitting(true);
                const groupConversation = await createGroup({
                  idsUser: Object.keys(groupData.listMembers),
                  groupName: groupData.groupName,
                  groupDesc: groupData.description,
                  chat: groupData.firstMessage,
                });
                console.log(groupConversation);
                if (Object.keys(groupConversation).length > 0) {
                  console.log('emit')
                  socket.emit("sendNewConversation", {
                    type: 'group',
                    members: Object.keys(groupData.listMembers),
                    // receiverEmail: email,
                    senderId: user?._id,
                    conversationId: groupConversation._id,
                    conversationName: groupConversation.name,
                    content: groupData.firstMessage,
                    time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                    // senderEmail: user?.email,
                    // senderUsername: user?.username,
                    // senderAvatar: user?.avatar,
                  })
                  setAlertStatus({
                    open: true,
                    message: "Create group successful",
                    type: "success",
                  })
                } else {
                  setAlertStatus({
                    open: true,
                    message: "Create group failed",
                    type: "error",
                  })
                }
                setIsSubmitting(false);
              }}
              variant="contained"
            >
              
              {isSubmitting ? (
                <CircularProgress
                  variant="indeterminate"
                  disableShrink
                  size={25}
                  thickness={4}
                  sx={{
                    color: "white",
                    animationDuration: "550ms",
                  }}
                />
              ) : (
                `Create Group`
              )}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
