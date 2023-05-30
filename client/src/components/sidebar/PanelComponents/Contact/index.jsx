import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";



import SearchInput from "../../../search";
import { textcolor, bcolors } from "../../../../colors";
import ContactList from "../../../contactList";
import { useEffect, useState, useContext } from "react";
import CustomerDialog from "../../../customDialog";
import { deepCopy } from "../../../../utils/general";
import { sortFriend } from "./data";


import { AuthContext } from "../../../../context/authContext";
import { conversationContext } from "../../../../context";
import { SocketContext } from "../../../../context/socket";

import moment from "moment";
function Contact() {
  const { addContact, userData } = useContext(conversationContext);
  const [openAddfriend, setOpenAddfriend] = useState(false);
  const [friendsBox, setFriendsBox] = useState(sortFriend);

  const [searchInput, setSearchInput] = useState("");

  const [contactList, setContactList] = useState([...userData.contactList]);
  // console.log(userData.contactList);
  const { socket } = useContext(SocketContext);
  const { authState: {
    user
  } } = useContext(AuthContext)
  const [helper, setHelper] = useState({
    email: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    chat: "",
  });
  const { email, chat } = formData;

  useEffect(() => {
    let temp = [];
    userData.contactList.forEach((contact) => {
      if (contact.type === "single") {
        if (
          contact.username.toLowerCase().includes(searchInput.toLowerCase())
        ) {
          temp.push(contact);
        }
      }
    });
    setContactList([...temp]);

    // Object.keys(friendsBox).forEach()
  }, [searchInput, userData.contactList]);

  // update contact list when add contact
  useEffect(() => {
    let friendBoxTemp = deepCopy(sortFriend);

    contactList.forEach((friend) => {
      if (friend.type === "single") {
        friendBoxTemp[friend.username[0].toLowerCase()].push(friend);
      }
    });
    setFriendsBox(friendBoxTemp);
  }, [contactList, searchInput]);

  // handle input in add contact form
  const handleDialog = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const clearForm = () => {
    setFormData({
      email: "",
      chat: "",
    });
    setHelper({
      email: "",
      message: "",
    });
  };

  //handle submit in add contact form
  const handleAddContact = async () => {
    const { email, chat } = formData;

    if (!email || !chat) {
      if (!email)
        setHelper({ ...helper, email: "Please enter a email address" });
      if (!chat) setHelper({ ...helper, message: "Please enter a message" });
      return;
    }

    let respone = await addContact(formData);
    if (respone.data.successful) {
      // updateContactList();
      
      socket.emit("sendNewConversation", {
        type: 'single',
        receiverEmail: email,
        senderId: user?._id,
        conversationId: respone.data.conversation._id,
        conversationName: userData?.chatInfo?.name,
        content: chat,
        time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        senderEmail: user?.email,
        senderUsername: user?.username,
        senderAvatar: user?.avatar,
      })
      setOpenAddfriend(false);
      clearForm();
    } else if (respone.data.isContact) {
      setHelper({ ...helper, email: "You already have a contact" });
    } else {
      setHelper({ ...helper, email: "Invalid email address" });
    }
  };

  return (
    <Box sx={{ height: "100%" }}>
      <CustomerDialog
        open={openAddfriend}
        setOpen={setOpenAddfriend}
        email={email}
        chat={chat}
        onChange={handleDialog}
        submit={handleAddContact}
        helperText={helper}
        setHelper={setHelper}
      />
      <Box sx={{ height: "6.75rem", p: 3 }}>
        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems="flex-start"
        // marginBottom="1.5rem"
        >
          <Typography
            sx={{
              color: textcolor.primaryGray,
              fontSize: "1.3125rem",
              marginBottom: "1.5rem",

            }}
          >
            Contacts
          </Typography>
          <Button
            sx={{
              color: textcolor.primaryGray,
            }}
            onClick={() => setOpenAddfriend(true)}
          >
            <PersonAddAltIcon />
          </Button>
        </Box>

        <SearchInput
          placeholder={"Search users..."}
          value={searchInput}
          onChange={setSearchInput}
        />
      </Box>
      <Box
        sx={{
          overflow: "scroll",
          height: "calc(100vh - 180px)",
          padding: "24px",
        }}
      >
        {
          // eslint-disable-next-line array-callback-return
          Object.keys(friendsBox).map((keyword) => {
            if (friendsBox[keyword].length > 0) {
              return (
                <Box key={keyword}>
                  <Box
                    padding={"16px"}
                    fontWeight={700}
                    fontSize={".9375rem"}
                    color={bcolors.main}
                  >
                    <Typography textTransform="uppercase">{keyword}</Typography>
                  </Box>
                  <ContactList listFriends={friendsBox[keyword]} />
                </Box>
              );
            }
          })
        }
      </Box>
    </Box>
  );
}

export default Contact;
