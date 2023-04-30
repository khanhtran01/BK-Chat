import * as React from "react";
// import { useContext, useState } from "react";
import axios from "axios";
import { conversationContext } from "../../../context";
import { useContext, useState } from "react";
// MUI import
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { bcolors, textcolor } from "../../../colors";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LeaveDialog(props) {
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
  const { userData, initData, out_of_conversation } = useContext(conversationContext)
  const { open, setOpen } = props;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async () => {
    try {
      const respone = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/api/conversation/out-group?conversationId=${userData.currConversationId}`)
      if (respone.status === 200) {
        setAlertStatus({
          open: true,
          message: "Leave conversation successfully",
          type: "success",
        })
        setIsSubmitted(false)

        setOpen(false)

        await initData();
        out_of_conversation();
      } else {
        setAlertStatus({
          open: true,
          message: "Leave conversation failed",
          type: "error",
        })
        setOpen(false)

      }
    }
    catch (err) {
      setAlertStatus({
        open: true,
        message: "Leave conversation failed",
        type: "error",
      })
      setOpen(false)

    }
    setIsSubmitted(false)

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
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: bcolors.dialog,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: textcolor.primaryGray,
          }}
        >
          {userData && userData.chatInfo && userData.chatInfo.type === "group" ? `Are you sure you want to exit the group?` : `Are you sure you want to block this user?`}
        </DialogTitle>
        <DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              variant="outlined"
            >
              No
            </Button>
            <Button
              onClick={() => {
                handleSubmit();
              }}
              variant="contained"
            >
              {isSubmitted ? (
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
                `Yes`
              )}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
