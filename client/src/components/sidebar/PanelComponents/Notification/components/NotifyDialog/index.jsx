import * as React from "react";

// MUI import
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { v4 as uuidv4 } from "uuid";
import { Avatar, Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from "../../../../../../context/authContext";
import { useContext, useState } from "react";
// import PendingIcon from "@mui/icons-material/Pending";
import { bcolors, textcolor } from "../../../../../../colors";
import CustomizedAccordions from "../../../../../accordion";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { conversationContext } from "../../../../../../context";
// import { groupsContext } from "../../context";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function NotifyDialog({
  open,
  setOpenDialog,
  members,
  conversationId,
  notifyId,
  confidence,
  topic,
  type,
  time,
}) {
  const { authState } = useContext(AuthContext)
  const { getAllNotify } = useContext(conversationContext)
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
  // console.log(authState);
  const handleVote = async (action) => {
    // [PUT] /api/notification/action [notifyId, action, conversationId]
    try {
      const response = await axios.put(`${process.env.REACT_APP_SERVER_ADDRESS}/api/notification/action`, {
        action: action,
        conversationId: conversationId,
        notifyId: notifyId,
      })
      if (response.status === 200 && response.data.successful === true) {
        console.log('successful')
        setAlertStatus({
          open: true,
          message: 'voted successfully',
          type: "success",
        });
        await getAllNotify()
      } else {
        setAlertStatus({
          open: true,
          message: response.data.message,
          type: "error",
        });
      }
    }
    catch (err) {
      console.log(err);
    }
  }
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
        onClose={() => setOpenDialog(false)}
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
          {"Suggestion"}
        </DialogTitle>
        <DialogContent>
          <Box>
            {
              type === "single" ? (<Typography sx={{ color: textcolor.primaryGray }}>
                {`The system suggests you create a new group on the topic ${topic}`}

              </Typography>) : (<Typography sx={{ color: textcolor.primaryGray }}>
                {`The system proposes to create a subgroup with ${members.length} people from group ${conversationId.name} about topic `}
                <em>{`${topic}`}</em>
                {` with confidence ${confidence}`}

              </Typography>)
            }

            <Typography
              sx={{ color: textcolor.primaryGray }}
            >{`The list of members includes : `}</Typography>
            <Box>
              <CustomizedAccordions
                title={
                  <Box
                    display={"flex"}
                    justifyContent="center"
                    alignItems={"flex-start"}
                  >
                    <Typography marginLeft={"5px"}>
                      The list of members includes
                    </Typography>
                  </Box>
                }
                description={
                  <Box
                    sx={{
                      maxHeight: "300px",
                      overflow: "scroll",
                    }}
                  >
                    {members.map((mem) => {
                      return (
                        <Box
                          key={uuidv4()}
                          display={"flex"}
                          alignItems={"center"}
                          padding={"6px"}
                          justifyContent={"space-between"}
                        >
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            padding={"6px"}
                          >
                            {mem.userId.avatar ? (
                              <Avatar
                                src={`${mem.userId.avatar}`}
                                alt={`${mem.userId.username}}`}
                                sx={{
                                  width: "28px",
                                  height: "28px",
                                }}
                              />
                            ) : (
                              <Avatar
                                sx={{
                                  backgroundColor: "#7269ef40",
                                  color: "rgb(114,105,239)",
                                  fontSize: ".9375rem",
                                  fontWeight: 500,
                                  textTransform: "uppercase",
                                  width: "28px",
                                  height: "28px",
                                }}
                              >
                                {mem.userId.username
                                  ? `${mem.userId.username[0]}`
                                  : "N"}
                              </Avatar>
                            )}
                            <Typography
                              color={textcolor.primaryGray}
                              marginLeft={"10px"}
                            >
                              {`${mem.userId.username}  ${authState && authState.user && authState.user._id === mem.userId._id ? '(me)' : ''}`}
                            </Typography>
                          </Box>
                          <Box>

                            {
                              mem.status === "pending" && (<Box>
                                <PendingActionsIcon sx={{
                                  color: bcolors.offline,
                                }} />
                              </Box>)
                            }
                            {
                              mem.status === "accept" && (<Box>

                                <CheckIcon sx={{ color: bcolors.online }} />
                              </Box>)
                            }
                            {
                              mem.status === "reject" && (<Box>
                                <CloseIcon sx={{ color: "#972400" }} />

                              </Box>)
                            }
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                }
              />
            </Box>
          </Box>
          <DialogActions sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <Button
              onClick={() => {
                // handleSubmitted("reject");
                setOpenDialog(false);
              }}
              variant="outlined"
            >
              Close
            </Button>
            <Box display={'flex'}>
              <Button
                sx={{
                  backgroundColor: "#972400",
                  color: "#E1E9F1",
                  ":hover": {
                    backgroundColor: "#bc4a27",
                  },
                  marginRight: '20px',
                  width: "100px",
                }}
                onClick={() => {
                  setOpenDialog(false);
                  handleVote('reject');
                }}
              >
                Reject
              </Button>
              <Button
                onClick={() => {
                  setOpenDialog(false);
                  handleVote('accept');
                }}
                sx={{
                  backgroundColor: bcolors.online,
                  color: "#E1E9F1",
                  ":hover": {
                    // opacity: 0.6,
                    backgroundColor: "#58d70f",
                  },
                  width: "100px",
                }}
              >
                Accept
              </Button>
            </Box>

          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
