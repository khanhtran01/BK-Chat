import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import { Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { bcolors, textcolor } from "../../colors";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomerDialog({
  open,
  setOpen,
  email,
  chat,
  onChange,
  submit,
  helperText,
  clearForm,
}) {
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
            color: textcolor.white,
          }}
        >
          {"Add Contacts?"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection={"column"} width="450px">
            <Typography
              sx={{
                paddingTop: "8px",
                paddingBottom: "5px",
                color: textcolor.white,
              }}
            >
              Email
            </Typography>
            <TextField
              sx={{
                ".MuiInputBase-root": {
                  color: "white",
                },
              }}
              name="email"
              value={email}
              onChange={onChange}
              hiddenLabel
              placeholder="Enter Email"
              error={helperText.email ? true : false}
              helperText={helperText.email}
            />
            <Typography
              sx={{
                paddingTop: "12px",
                paddingBottom: "5px",
                color: textcolor.white,
              }}
            >
              Invatation Message
            </Typography>
            <TextField
              sx={{
                ".MuiInputBase-root": {
                  color: "white",
                },
              }}
              name="chat"
              value={chat}
              onChange={onChange}
              multiline
              hiddenLabel
              placeholder="Enter Message"
              error={helperText.message ? true : false}
              helperText={helperText.message}
            />
          </Box>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
                clearForm();
              }}
              variant="outlined"
            >
              Close
            </Button>
            <Button onClick={submit} variant="contained">
              Invite Contact
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}