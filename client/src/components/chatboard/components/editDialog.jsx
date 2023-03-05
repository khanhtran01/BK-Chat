import * as React from "react";
import { useContext, useState } from "react";
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

// import { bcolors, textcolor } from "../../../../../colors";
import { bcolors, textcolor } from "../../../colors";

import { conversationContext } from "../../../context";
import { chatboardContext } from "../context";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditGroupDialog() {
  const { editFormData, handleAvatar, handleDescription, handleName, handleDialog } =
    useContext(chatboardContext);

  const { userData } = useContext(conversationContext);

  const handleSubmit = async () => {
    await axios.put("http://localhost:4000/api/conversation/update-group-info", {
      "conversationId": userData.chatInfo.conversationId,
      "groupAvatar": editFormData.avatar.file,
      "groupName": editFormData.name,
      "groupDesc": editFormData.description,
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }
    ).then(response => {
    })
    .catch(err => {
      console.log(err);
    })
    // await axios.post("")

  };
  return (
    <div>
      <Dialog
        open={editFormData.openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleDialog(false)}
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
          {"Change Infomation"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            display="flex"
            flexDirection={"column"}
            width="450px"
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
              value={editFormData.name}
              onChange={(e) => handleName(e.target.value)}
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
              value={editFormData.description}
              onChange={(e) => handleDescription(e.target.value)}
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
              value={editFormData.avatar.name}
              onChange={(e) => handleAvatar({name : e.target.value, file: e.target.files[0]})}
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
              Confirm
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
