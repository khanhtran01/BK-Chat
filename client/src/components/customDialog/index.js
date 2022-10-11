import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { bcolors, textcolor } from "../../colors";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomerDialog({ open, setOpen }) {
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
              hiddenLabel
              placeholder="Enter Email"
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
              multiline
              hiddenLabel
              placeholder="Enter Message"
            />
          </Box>
          <DialogActions>
            <Button onClick={() => setOpen(false)} variant="outlined">
              Close
            </Button>
            <Button variant="contained">Invite Contact</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
