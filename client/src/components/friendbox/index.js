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
  const { url, status, id, name, message, time, receiverId, type, numUnRead, member } =
    props;

  const { selectConversation } = useContext(conversationContext);

  const convertTime = (time) => {
    let today = new Date();
    if (moment(today).date() === moment(time).date()) {
      return moment(time).format("HH:mm");
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
        textTransform: "capitalize",
        ".MuiButton-root": {
          backgroundColor: "white",
        },
      }}
      onClick={() => selectConversation({ id, name, url, receiverId, type, member })}
    >
      <Box
        sx={{
          height: "40px",
          width: "40px",
        }}
      >
        <BadgeAvatars url={url} status={status} name={name} />
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
            fontWeight: numUnRead > 0 ? 550: 400,
            color: numUnRead > 0 && textcolor.primaryGray,
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
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            fontSize: "11px",
          }}
        >
          {convertTime(time)}
        </Typography>
        {numUnRead > 0 && (
          <Typography
            sx={{
              fontSize: "11px",
              color: "#ef476f",
              backgroundColor: "rgba(239,71,111,.18)",
              padding: "2px 3px",
              borderRadius: "20px",
            }}
          >
            {numUnRead}
          </Typography>
        )}
      </Box>
    </CustomButton>
  );
}

export default FriendBox;
