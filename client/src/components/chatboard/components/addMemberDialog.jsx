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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMemberDialog(props) {
  // const { userData, initData } = useContext(conversationContext);
  const [searchText, setSearchText] = useState("");
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [allContact, setAllContact] = useState([]);
  const [contactAfterSearch, setContactAfterSearch] = useState([]);

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
  const handleSubmit = async () => {};

  useEffect(() => {
    const getAllConversations = async () => {
      if (currConversationId !== "") {
        try {
          const respone = await axios.get(
            `http://localhost:4000/api/conversation/check-contact-group?conversationId=${currConversationId}`
          );
          setAllContact(respone.data.allContact);
          console.log(respone.data.allContact);
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
              <Box>
                {Object.values(selectedMember).map((member) =>
                  member.avatar ? (
                    <Box
                      key={uuidv4()}
                      position="relative"
                      width={"fit-content"}
                    >
                      <Avatar
                        src={`${member.avatar}`}
                        alt={`${member.username}}`}
                        sx={{
                          width: "35px",
                          height: "35px",
                        }}
                      />
                      <Box
                        position="absolute"
                        borderRadius={"50%"}
                        top={-10}
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
                        }}
                      >
                        {member.username ? `${member.username[0]}` : "N"}
                      </Avatar>
                      <Box
                        position="absolute"
                        borderRadius={"50%"}
                        top={-10}
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
              Add
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
