import * as React from "react";
import { useContext } from "react";

// MUI import
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { bcolors, textcolor } from "../../../../../../colors";
import { groupsContext } from "../../context";
import SelectButton from "./components/SelectButton";
import ListMember from "./components/ListMember";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GroupDialog() {
  const { groupData, handleCreateGroup, openSelectPopup } =
    useContext(groupsContext);
  return (
    <div>
      <Dialog
        open={groupData.groupDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleCreateGroup(false)}
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
          {"Create New Group"}
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
              Group Name
            </Typography>
            <TextField
              sx={{
                ".MuiInputBase-root": {
                  color: "white",
                },
              }}
              name="name"
              hiddenLabel
              placeholder="Enter Group Name"
            />

            <Typography
              sx={{
                paddingTop: "12px",
                paddingBottom: "5px",
                color: textcolor.white,
              }}
            >
              Group Members
            </Typography>
            <Box>
              <ListMember />
              <Box
                sx={{
                  width: "10rem",
                }}
              >
                <SelectButton onClick={openSelectPopup}>
                  Select members
                </SelectButton>
              </Box>
            </Box>

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
              name="description"
              multiline
              hiddenLabel
              placeholder="Enter Description"
            />
          </Box>
          <DialogActions>
            <Button
              onClick={() => {
                handleCreateGroup(false);
              }}
              variant="outlined"
            >
              Close
            </Button>
            <Button variant="contained">Create Group</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
