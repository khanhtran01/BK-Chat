import * as React from "react";
import { useContext } from "react";
import axios from "axios";

// MUI import
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import { Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";

// import { bcolors, textcolor } from "../../../../../colors";
import { bcolors, textcolor } from "../../../colors";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { conversationContext } from "../../../context";
import { chatboardContext } from "../context";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function EditGroupDialog({ initData }) {
  const { editFormData, handleDialog } =
    useContext(chatboardContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertStatus, setAlertStatus] = useState({
    open: false,
    message: "",
    type: "error",
  });
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertStatus({
      ...alertStatus,
      open: false,
    });
  };
  const { userData } = useContext(conversationContext);
  React.useEffect(() => {
    setEditForm({
      groupname: userData.chatInfo.name,
      avatar: {
        name: "",
        file: null,
      },
      description: userData.chatInfo.desc,
      openDialog: false,
    })
  }, [JSON.stringify(userData.chatInfo)])
  console.log(userData.chatInfo);
  const [editForm, setEditForm] = useState({
    groupname: initData.name,
    avatar: {
      name: "",
      file: null,
    },
    description: userData.chatInfo.desc,
    openDialog: false,
  })



  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      let response = await axios.put(`${process.env.REACT_APP_SERVER_ADDRESS}/api/conversation/update-group-info`, {
        "conversationId": userData.chatInfo.conversationId,
        "groupAvatar": editForm.avatar.file,
        "groupName": editForm.groupname,
        "groupDesc": editForm.description,
      }, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
      )
      if (response.data.successful) {
        setAlertStatus({
          open: true,
          message: "Update successful, please reload the page to see the change",
          type: "success",
        });
        setEditForm({
          groupname: userData.chatInfo.name,
          avatar: {
            name: "",
            file: null,
          },
          description: userData.chatInfo.desc,
          openDialog: false,
        })
      }
    }
    catch (err) {
      setAlertStatus({
        open: true,
        message: "Update failed",
        type: "error",
      });
    }
    setIsSubmitting(false)

    // await axios.post("")
    handleDialog(false);

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
        open={editFormData.openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleDialog(false)}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: bcolors.dialog,
            width: "90%"
          },
        }}
      >
        <DialogTitle
          sx={{
            color: textcolor.primaryGray,
          }}
        >
          {"Change Infomation"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            display="flex"
            flexDirection={"column"}
            width="100%"
          >
            <Typography
              sx={{
                paddingTop: "8px",
                paddingBottom: "5px",
                color: textcolor.white,
              }}
            >
              Group name
            </Typography>
            <TextField
              sx={{
                ".MuiInputBase-root": {
                  color: "white",
                },
              }}
              value={editForm.groupname}
              onChange={(e) => setEditForm({ ...editForm, groupname: e.target.value })}
              name="groupname"
              hiddenLabel
              placeholder="Enter group name"
            />

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
              type="number"
              name="age"
              multiline
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
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
              Avatar
            </Typography>
            <TextField
              sx={{
                ".MuiInputBase-root": {
                  color: "white",
                },
              }}
              type="file"
              name="avatar"
              value={editForm.avatar.name}
              onChange={(e) => setEditForm(
                {
                  ...editForm,
                  avatar: {
                    ...editForm.avatar,
                    name: e.target.value,
                    file: e.target.files[0],
                  }
                }
              )}
              hiddenLabel
              placeholder="Enter avatar file"
            />
          </Box>
          <DialogActions>
            <Button
              onClick={() => {
                handleDialog(false);
              }}
              variant="outlined"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                // handleCreateGroup(false);
                // createGroup({
                //   idsUser: Object.keys(groupData.listMembers),
                //   groupName: groupData.groupName,
                //   groupDesc: groupData.description,
                //   chat: groupData.firstMessage,
                // });
                handleSubmit();
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
                `Confirm`
              )}

            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
