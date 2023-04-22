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
import { Avatar, Box, Typography } from "@mui/material";
import SearchInput from "../../search";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";
import { selectMemberContext } from "../context/addMemberContext";
import { bcolors, textcolor } from "../../../colors";
import SelectList from "./selectListDialog";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddMemberDialog(props) {
  const [alertStatus, setAlertStatus] = useState({
    open: false,
    message: "",
    type: "error",
  });
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertStatus({
      ...alertStatus,
      open: false,
    });
  };
  // const { userData, initData } = useContext(conversationContext);
  const [searchText, setSearchText] = useState("");
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [allContact, setAllContact] = useState([]);
  const [contactAfterSearch, setContactAfterSearch] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedMember, setSelectedMember } = useContext(selectMemberContext);

  const handleRemoveMember = (memId) => {
    let temp = { ...selectedMember };
    delete temp[memId];
    setSelectedMember({ ...temp });
  };

  const {
    userData: { currConversationId },
  } = useContext(conversationContext);
  const { open, setOpen } = props;
  const handleSubmit = async () => {
    // console.log(Object.keys(selectedMember))
    setIsSubmitting(true)
    try {
      if (Object.keys(selectedMember).length > 0) {
        let response = await axios.put(`${process.env.REACT_APP_SERVER_ADDRESS}/api/conversation/add-member`, {
          conversationId: currConversationId,
          idsUser: Object.keys(selectedMember)
        })
        console.log(response);
        if (response.data.successful) {
          setSelectedMember({})
          setAlertStatus({
            open: true,
            message: "Add successful",
            type: "success",
          });
        }
      }
    }
    catch (err) {
      // console.log(err);
      setAlertStatus({
        open: true,
        message: "Add failed",
        type: "error",
      });
    }
    setIsSubmitting(false)
    setOpen(false);
  };

  useEffect(() => {
    const getAllConversations = async () => {
      if (currConversationId !== "") {
        try {
          const respone = await axios.get(
            `${process.env.REACT_APP_SERVER_ADDRESS}/api/conversation/check-contact-group?conversationId=${currConversationId}`
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
      <Snackbar
        open={alertStatus.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertStatus.type}
          sx={{ width: "100%" }}
        >
          {alertStatus.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: bcolors.dialog,
            width: "100%",
            maxWidth: "400px",
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
          <Box marginBottom="20px">
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
            {Object.values(selectedMember).length === 0 ? (
              <Box display={"flex"} justifyContent="center" alignItems="center">
                <Typography sx={{ color: textcolor.primaryGray }}>
                  No member is selected now!
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'scroll' }}
              >
                {Object.values(selectedMember).map((member) =>
                  member.avatar ? (
                    <Box
                      key={uuidv4()}
                      position="relative"
                      width={"fit-content"}
                      marginRight={"15px"}
                    >
                      <Avatar
                        src={`${member.avatar}`}
                        alt={`${member.username}}`}
                        sx={{
                          width: "35px",
                          height: "35px",
                          marginTop: "10px",
                        }}
                      />
                      <Box
                        position="absolute"
                        borderRadius={"50%"}
                        top={0}
                        right={-10}
                        backgroundColor={bcolors.dialog}
                        onClick={() => handleRemoveMember(member.userId)}
                      >
                        <CloseIcon
                          sx={{
                            color: textcolor.primaryGray,
                            height: "18px",
                            widows: "18px",
                          }}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      key={uuidv4()}
                      position="relative"
                      width={"fit-content"}
                      marginRight={"15px"}
                    >
                      <Avatar
                        sx={{
                          backgroundColor: "#7269ef40",
                          color: "rgb(114,105,239)",
                          fontSize: ".9375rem",
                          fontWeight: 500,
                          textTransform: "uppercase",
                          width: "35px",
                          height: "35px",
                          marginTop: "10px"
                        }}
                      >
                        {member.username ? `${member.username[0]}` : "N"}
                      </Avatar>
                      <Box
                        position="absolute"
                        borderRadius={"50%"}
                        top={0}
                        right={-10}
                        backgroundColor={bcolors.dialog}
                        onClick={() => handleRemoveMember(member.userId)}
                      >
                        <CloseIcon
                          sx={{
                            color: textcolor.primaryGray,
                            height: "18px",
                            widows: "18px",
                          }}
                        />
                      </Box>
                    </Box>
                  )
                )}
              </Box>
            )}

            {/* {isLoadingConversation && <CircularProgress />} */}
          </Box>
          <Box marginBottom="20px">
            <Typography
              sx={{
                color: textcolor.primaryGray,
                userSelect: "none",
              }}
            >
              Member
            </Typography>
          </Box>
          <Box
            sx={{
              minHeight: "100px",
              maxHeight: "150px",
              overflow: "scroll"
            }}
          >
            {isLoadingConversation && <CircularProgress />}
            {!isLoadingConversation && <SelectList data={contactAfterSearch} />}
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
              {isSubmitting ? (
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
                `Add`
              )}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
