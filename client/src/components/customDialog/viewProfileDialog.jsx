import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Avatar } from "@mui/material";
// import DialogContentText from "@mui/material/DialogContentText";
import { Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import { bcolors, textcolor } from "../../colors";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ViewProfileDiaglog({ open, setOpen, userInfo }) {
  return (
    <div
      style={{
        zIndex: 10,
      }}
    >
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
          {"Profile"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection={"column"} width="450px">
            <Box
            display="flex"
            flexDirection={"column"}
            justifyContent="center"
            alignItems="center"
            >
              <Box
                height="6.5rem"
                width="6.5rem"
                borderRadius="50%"
                border={"solid 1px #36404a"}
                display="flex"
                justifyContent="center"
                alignItems={"center"}
              >
                {userInfo.avatar ? (
                  <Avatar
                    src={`${userInfo.avatar}`}
                    alt={`${userInfo.username}}`}
                    sx={{ height: "5.375rem", width: "5.375rem" }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      backgroundColor: "#7269ef40",
                      color: "rgb(114,105,239)",
                      fontSize: ".9375rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      height: "5.375rem",
                      width: "5.375rem",
                    }}
                  >
                    {userInfo.username ? `${userInfo.username[0]}` : "N"}
                  </Avatar>
                )}
              </Box>
              <Typography
                fontWeight={600}
                marginBottom={0.5}
                marginTop={3}
                color={textcolor.primaryGray}
              >
                {userInfo.username}
              </Typography>
            </Box>

            {/* <CircularProgress
              variant="indeterminate"
              disableShrink
              size={25}
              thickness={4}
              sx={{
                color: "white",
                animationDuration: "550ms",
              }}
            /> */}
          </Box>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              height="36px"
              variant="outlined"
            >
              Back
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
