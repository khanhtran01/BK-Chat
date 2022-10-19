import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { textcolor } from "../../colors";
import { styled } from "@mui/material/styles";
import { conversationContext } from "../../context";
import { useContext } from "react";
import BadgeAvatars from "../avatar";
import moment from "moment";

const CustomButton = styled(Button)({
  "&:focus": {
    backgroundColor: "#36404a",
  },
});

function FriendBox(props) {
  const { url, status, id, name, message, time, selected, receiverId, type } =
    props;

  const { selectConversation } = useContext(conversationContext);

  const convertTime = (time) => {
    let today = new Date();
    if (moment(today).date() === moment(time).date()) {
      return moment(time).hours() + ":" + moment(time).minutes();
    } else {
      return moment(time).format("DD/MM");
    }
  };
  return (
    <CustomButton
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "73px",
        padding: "15px 20px",
        color: textcolor.white,
        backgroundColor: selected && "#36404a",
        textTransform: "capitalize",
        ".MuiButton-root": {
          backgroundColor: "white",
        },
      }}
      onClick={() => selectConversation({ id, name, url, receiverId, type })}
    >
      <Box
        sx={{
          height: "40px",
          width: "40px",
        }}
      >
        <BadgeAvatars url={url} status={status} />
      </Box>
      <Box
        sx={{
          width: " 80%",
          height: "100%",
          paddingLeft: "10px",
          textAlign: "left",
        }}
      >
        <Typography
          sx={{
            color: textcolor.primaryGray,
            fontSize: "15px",
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            fontSize: "14px",
          }}
        >
          {message}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "29.55px",
          height: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          fontSize: "11px",
        }}
      >
        {convertTime(time)}
      </Box>
    </CustomButton>
  );
}

export default FriendBox;
