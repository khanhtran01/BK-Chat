import * as React from "react";
import { useContext } from "react";

// MUI import
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { v4 as uuidv4 } from "uuid";
import { Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import axios from "axios";
import { apiUrl } from "../../../../../../context/constant";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CircularProgress from '@mui/material/CircularProgress';


import PendingIcon from '@mui/icons-material/Pending';
import { bcolors, textcolor } from "../../../../../../colors";

// import { conversationContext } from "../../../../../../context";
// import { groupsContext } from "../../context";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function NotifyDialog({
  open,
  setOpenDialog,
  members,
  conversationId,
  notifyId,
}) {
  const handleSubmitted = async (status) => {
    axios
      .put(`${apiUrl}/notification/action`, {
        notifyId,
        status,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
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
          {"Notify"}
        </DialogTitle>
        <DialogContent>
          <Box>
            <Typography sx={{ color: textcolor.primaryGray }}>
              {`The system proposes to create a subgroup with ${members.length} people from group ${conversationId.name}`}
            </Typography>
            <Typography
              sx={{ color: textcolor.primaryGray }}
            >{`The list of members includes : `}</Typography>
            <Box>
              {members.map((member) => (
                <Box key={uuidv4()} sx={{ display: "flex", alignItems: "center" }}>
                  {member.accept === "accept" ? (
                    <CheckIcon
                      sx={{ color: bcolors.online, marginRight: "5px" }}
                    />
                  ) : member.accept === "reject" ? (
                    <CloseIcon sx={{ color: "red", marginRight: "5px" }} />
                  ) : (
                    <CircularProgress
                      sx={{ color: textcolor.white, marginRight: "14px", width: "15px !important", height: "15px !important" }}
                    />
                  )}

                  <Typography sx={{ color: textcolor.primaryGray }}>
                    {member.userId.username}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <DialogActions>
            <Button
              onClick={() => {
                handleSubmitted("reject");
                setOpenDialog(false);
              }}
              variant="outlined"
            >
              Reject
            </Button>
            <Button
              onClick={() => {
                handleSubmitted("accept");
                setOpenDialog(false);
              }}
              variant="contained"
            >
              Accept
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
