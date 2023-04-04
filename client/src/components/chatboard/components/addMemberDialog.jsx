import * as React from "react";
// import { useContext, useState } from "react";
import axios from "axios";
import { conversationContext } from "../../../context";
import { useContext, useState, useEffect } from "react";
// MUI import
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Typography } from "@mui/material";
import SearchInput from "../../search";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";
import { v4 as uuidv4 } from "uuid";
import { bcolors, textcolor } from "../../../colors";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMemberDialog(props) {
  // const { userData, initData } = useContext(conversationContext);
  const [searchText, setSearchText] = useState("");
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [allContact, setAllContact] = useState([]);
  const [contactAfterSearch, setContactAfterSearch] = useState([]);
  const {
    userData: { currConversationId },
  } = useContext(conversationContext);
  const { open, setOpen } = props;
  const handleSubmit = async () => {};

  useEffect(() => {
    const getAllConversations = async () => {
      if (currConversationId !== "") {
        try {
          const respone = await axios.get(
            `http://localhost:4000/api/conversation/check-contact-group?conversationId=${currConversationId}`
          );
          setAllContact(respone.data.allContact);
          setIsLoadingConversation(false);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getAllConversations();
  }, [currConversationId]);

  useEffect(() => {
    let temp = [];
    allContact.forEach((contact) => {
      if (contact.username.toLowerCase().includes(searchText.toLowerCase())) {
        temp.push(contact);
      }
    });

    setContactAfterSearch(temp);
  }, [searchText, allContact]);

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
          <SearchInput
            placeholder={"Search members"}
            value={searchText}
            onChange={setSearchText}
          />
          <Box>
            <Typography
              sx={{
                color: textcolor.primaryGray,
              }}
            >
              Member have been selected
            </Typography>
          </Box>
          <Box
            sx={{
              height: "60px",
            }}
          >
            {isLoadingConversation && <CircularProgress />}
          </Box>
          <Box>
            <Typography
              sx={{
                color: textcolor.primaryGray,
              }}
            >
              Member
            </Typography>
          </Box>
          <Box
            sx={{
              minHeight: "100px",
              maxHeight: "150px",
            }}
          >
            {isLoadingConversation && <CircularProgress />}
            {!isLoadingConversation && (
              <Box>
                {contactAfterSearch.map((contact) => (
                  <Box key={uuidv4()}>{contact.username}</Box>
                ))}
              </Box>
            )}
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
