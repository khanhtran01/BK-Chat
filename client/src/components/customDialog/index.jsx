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
import CircularProgress from "@mui/material/CircularProgress";
import ViewProfileDiaglog from "./viewProfileDialog";
import { bcolors, textcolor } from "../../colors";
import axios from "axios";
// import { SocketContext } from "../../context/socket";
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
  setHelper,
}) {
  const [isSubmiting, setIsSubmiting] = React.useState(false);
  const [friendInfo, setFriendInfo] = React.useState({});
  // const { socket } = React.useContext(SocketContext);

  const handleSubmit = async () => {
    setIsSubmiting(true);
    await submit();
    setIsSubmiting(false);
  };
  const [openProfile, setOpenProfile] = React.useState(false);
  const handleOpenViewProfie = async (openDialog) => {
    if (openDialog) {
      if (await handleLoadProfile()) {
        setOpen(false);
        setOpenProfile(true);
      }
    } else {
      setOpen(true);
      setOpenProfile(false);
    }
  };

  const handleLoadProfile = async () => {
    try {
      const respone = await axios.get(
        `${process.env.REACT_APP_SERVER_ADDRESS}/api/user/search-contact?email=${email}`
      );
      if (!email) {
        setHelper({ ...helperText, email: "Please enter a email address" });
        return false;
      }

      if (respone.data.successful) {
        // updateContactList();
        setFriendInfo({ ...respone.data.user });
        setHelper({});
        return true;
      } else if (respone.data.isContact) {
        setHelper({ ...helperText, email: "You already have a contact" });
      } else {
        setHelper({ ...helperText, email: "Invalid email address" });
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  return (
    <div>
      {openProfile && (
        <ViewProfileDiaglog
          open={openProfile}
          setOpen={handleOpenViewProfie}
          userInfo={friendInfo}
        />
      )}

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
            <Box width={"100%"} position={"relative"}>
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
                  width: "100%",
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
              <Box
                onClick={() => {
                  handleOpenViewProfie(true);
                }}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "94px",
                  color: textcolor.white,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                <Typography
                  sx={{
                    zIndex: 5,
                    cursor: "pointer",
                    userSelect: "none",
                    fontStyle: "italic",
                  }}
                >
                  {`view profile →`}
                </Typography>
              </Box>
            </Box>

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
                setHelper({});
              }}
              height="36px"
              variant="outlined"
            >
              Close
            </Button>
            <Button
              onClick={handleSubmit}
              sx={{
                height: "36px",
                width: "154px",
              }}
              variant="contained"
            >
              {isSubmiting ? (
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
                `Invite Contact`
              )}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
