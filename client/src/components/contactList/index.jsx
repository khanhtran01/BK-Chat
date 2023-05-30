import { Box, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LongMenu from "../menu";
import { textcolor } from "../../colors";
// const menuOptions = [
//   {
//     component: "Share",
//     handle: () => { },
//   },
// ];

function ContactList({ listFriends }) {
  // console.log(listFriends);
  return (
    <Box padding="10px 20px">
      {listFriends.map((contact) => (
        <Box
          key={contact.userId}
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
          cursor="pointer"
          color={textcolor.primaryGray}
        >
          <Typography>{contact.username}</Typography>
          <LongMenu
            icon={<MoreVertIcon sx={{ color: textcolor.primaryGray }} />}
            options={[
              {
                component: "Share",
                handle: () => { navigator.clipboard.writeText(`${contact.email}`) },
              },
            ]}
          />
        </Box>
      ))}
    </Box>
  );
}

export default ContactList;
