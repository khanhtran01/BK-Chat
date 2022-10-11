import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchInput from "../../../search";
import { textcolor, bcolors } from "../../../../colors";
import ContactList from "../../../contactList";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CustomerDialog from "../../../customDialog";
import { v4 as uuidv4 } from "uuid";
import { deepCopy } from "../../../../functions";
import { friendList, sortFriend } from "./data";
function Contact() {
  const [friendsBox, setFriendsBox] = useState(sortFriend);
  useEffect(() => {
    let friendBoxTemp = deepCopy(sortFriend);
    console.log(sortFriend);

    // eslint-disable-next-line array-callback-return
    friendList.map((friend) => {
      friendBoxTemp[friend.username[0].toLowerCase()].push(friend);
    });
    console.log(friendBoxTemp);

    setFriendsBox(friendBoxTemp);
    // friendBoxTemp = { ...sortFriend };
  }, []);
  //   console.log(friendsBox);
  const [openAddfriend, setOpenAddfriend] = useState(false);
  // const [client, setClient] = useContext(Context);
  return (
    <Box sx={{ height: "100%" }}>
      <CustomerDialog open={openAddfriend} setOpen={setOpenAddfriend} />
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
