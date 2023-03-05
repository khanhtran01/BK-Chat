import * as React from "react";
import { useContext } from "react";

// MUI import
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import { Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import { bcolors, textcolor } from "../../../../../colors";

import { ProfileContext } from "../context";
import axios from "axios";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditDialog() {
  const {
    profileData,
    handleDialog,
    handleUsername,
    handleLocation,
    handleDescription,
    handleAvatar,
  } = useContext(ProfileContext);
  const handleSubmit = async () => {
    await axios.put("http://localhost:4000/api/user/update-personal-info", {
      "avatar": profileData.avatar.file,
      "username": profileData.username,
      "desc": profileData.description,
      "address": profileData.location,
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }
    )
  }
  return (
    <div>
      <Dialog
        open={profileData.openDialog}
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
              Username
            </Typography>
            <TextField
              sx={{
                ".MuiInputBase-root": {
                  color: "white",
                },
              }}
              value={profileData.username}
              onChange={(e) => handleUsername(e.target.value)}
              name="username"
              hiddenLabel
              placeholder="Enter Username"
            />

            <Typography
              sx={{
                paddingTop: "12px",
                paddingBottom: "5px",
                color: textcolor.white,
              }}
            >
              Location
            </Typography>
            <TextField
              sx={{
                ".MuiInputBase-root": {
                  color: "white",
                },
              }}
              name="location"
              value={profileData.location}
              onChange={(e) => handleLocation(e.target.value)}
              multiline
              hiddenLabel
              placeholder="Enter Location"
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
              value={profileData.avatar.name}
              name="avatar"
              onChange={(e) => handleAvatar({name: e.target.value, file: e.target.files[0]})}
              hiddenLabel
              placeholder="Enter avatar file"
            />
            <Typography
              sx={{
                paddingTop: "12px",
                paddingBottom: "5px",
                color: textcolor.white,
              }}
            >
              Desciption
            </Typography>
            <TextField
              sx={{
                ".MuiInputBase-root": {
                  color: "white",
                },
              }}
              name="description"
              value={profileData.description}
              onChange={(e) => handleDescription(e.target.value)}
              multiline
              hiddenLabel
              placeholder="Enter Description"
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
