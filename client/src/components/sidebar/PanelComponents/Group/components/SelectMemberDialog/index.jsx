import * as React from "react";
import { useContext, useEffect, useState } from "react";
// MUI import
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";

// import material
import { bcolors, textcolor } from "../../../../../../colors";
// import context
import { groupsContext } from "../../context";
import { conversationContext } from "../../../../../../context";
// import components
import SelectList from "./components/SelectList";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SelectMemberDialog() {
  const { groupData, closeSelectPopup } = useContext(groupsContext);
  const { userData } = useContext(conversationContext);
  const [contactList, setContactList] = useState([]);
  useEffect(() => {
    let temp = [...userData.contactList];
    temp = temp.filter(contact => contact.type === 'single');
    temp.sort((a, b) => a.username.localeCompare(b.username));

    const mountLabel = {};

    for (let i = 0; i < temp.length; i++) {
      const key = temp[i].username[0].toLowerCase();
      if (mountLabel[key] !== undefined) {
        mountLabel[key] = [...mountLabel[key], temp[i].username];
      } else {
        mountLabel[key] = [temp[i].username];
      }
    }
    setContactList(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(userData.contactList)]);

  return (
    <div>
      <Dialog
        open={groupData.selectMemberPopup}
        TransitionComponent={Transition}
        keepMounted
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
          {"Select Members"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection={"column"} width="450px">
            <SelectList data={contactList} />
          </Box>
          <DialogActions>
            {/* <Button variant="outlined">
              Close
            </Button> */}
            <Button onClick={closeSelectPopup} variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
