import * as React from "react";
// import { useContext, useState } from "react";
import axios from "axios";
import { conversationContext } from "../../../context";
import { useContext } from "react";
// MUI import
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import { bcolors, textcolor } from "../../../colors";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LeaveDialog(props) {
  //   const {
  //     profileData,
  //     handleDialog,
  //     handleUsername,
  //     handleAge,
  //     handleLocation,
  //     handleDescription,
  //     handleAvatar,
  //   } = useContext(ProfileContext);
  const { userData } = useContext(conversationContext)
  const { open , setOpen } = props;
  const handleSubmit = async () => {
    console.log(userData.currConversationId);
    await axios.get(`http://localhost:4000/api/conversation/out-group?conversationId=${userData.currConversationId}`)
    setOpen(false)
  };
  return (
    <div>
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
          {"Are you sure you want to exit the group?"}
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
              Yes
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
