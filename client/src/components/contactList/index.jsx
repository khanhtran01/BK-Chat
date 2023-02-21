import { Box, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LongMenu from "../menu";
import { textcolor } from "../../colors";
const menuOptions = [
  {
    component: "Share",
    handle: () => {},
  },
  {
    component: "Block",
    handle: () => {},
  },
  {
    component: "Remove",
    handle: () => {},
  },
];

function ContactList({ listFriends }) {
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
            options={menuOptions}
          />
        </Box>
      ))}
    </Box>
  );
}

export default ContactList;