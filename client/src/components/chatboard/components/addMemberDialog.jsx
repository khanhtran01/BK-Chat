import * as React from "react";
// import { useContext, useState } from "react";
import axios from "axios";
import { conversationContext } from "../../../context";
import { useContext, useState } from "react";
// MUI import
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Typography } from "@mui/material";
import SearchInput from "../../search";
import Slide from "@mui/material/Slide";

import { bcolors, textcolor } from "../../../colors";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMemberDialog(props) {
  // const { userData, initData } = useContext(conversationContext);
  const [searchText, setSearchText] = useState("");
  const { open, setOpen } = props;
  const handleSubmit = async () => {
    // await axios.get(`http://localhost:4000/api/conversation/out-group?conversationId=${userData.currConversationId}`)
    // setOpen(false)
    // await initData();
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
          {"Add members to group"}
        </DialogTitle>
        <DialogContent>
          <SearchInput placeholder={"Search members"} value={searchText} onChange={setSearchText}/>
					<Box>
						<Typography>Member have been selected</Typography>
					</Box>

					<Box>
						<Typography>Member</Typography>
					</Box>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
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
              Add
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
