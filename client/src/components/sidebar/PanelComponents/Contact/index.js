import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchInput from "../../../search";
import { textcolor, bcolors } from "../../../../colors";
import ContactList from "../../../contactList";
import { useEffect, useState, useContext } from "react";
import Button from "@mui/material/Button";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CustomerDialog from "../../../customDialog";
import { v4 as uuidv4 } from "uuid";
import { deepCopy } from "../../../../functions";
import { conversationContext } from "../../../../context";
import { sortFriend } from "./data";
function Contact() {
  const { addContact, getAllContact, userData } =
    useContext(conversationContext);
  const [openAddfriend, setOpenAddfriend] = useState(false);

  const [friendsBox, setFriendsBox] = useState(sortFriend);
  const [formData, setFormData] = useState({
    email: "",
    chat: "",
  });

  const { email, chat } = formData;

  // init friend list when swap to contact page
  // run 1 time
  useEffect(() => {
    let friendBoxTemp = deepCopy(sortFriend);
    // eslint-disable-next-line array-callback-return
    userData.contactList.map((friend) => {
      friendBoxTemp[friend.username[0].toLowerCase()].push(friend);
    });
    setFriendsBox(friendBoxTemp);
  }, []);

  // update contact list when add contact
  const updateContactList = async () => {
    let friendBoxTemp = deepCopy(sortFriend);
    console.log("render update");
    let data = await getAllContact();
    // eslint-disable-next-line array-callback-return
    data.map((friend) => {
      friendBoxTemp[friend.username[0].toLowerCase()].push(friend);
    });
    setFriendsBox(friendBoxTemp);
  };

  const handleDialog = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleAddContact = async () => {
    let respone = await addContact(formData);
    if (respone.data.successful) {
      console.log("add complete");
      updateContactList();
      setOpenAddfriend(false);
    } else {
      console.log("add false");
      if (respone.data.isContact) {
        console.log("friended");
      } else {
        console.log("wrong email");
      }
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
      />
      <Box sx={{ height: "10rem", p: 3 }}>
        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
          marginBottom="1.5rem"
        >
          <Typography
            sx={{
              color: textcolor.primaryGray,
              fontSize: "1.3125rem",
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

        <SearchInput placeholder={"Search users..."} />
      </Box>
      <Box
        sx={{
          overflow: "scroll",
          height: "calc(100vh - 180px)",
          padding: "24px",
        }}
      >
        {Object.keys(friendsBox).map((keyword) => {
          if (friendsBox[keyword].length > 0) {
            return (
              <Box key={uuidv4()}>
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
        })}
      </Box>
    </Box>
  );
}

export default Contact;
