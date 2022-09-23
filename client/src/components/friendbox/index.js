import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { textcolor } from "../../colors";
import { styled } from "@mui/material/styles";
import BadgeAvatars from "../avatar";

const CustomButton = styled(Button)({
  "&:focus": {
    backgroundColor: "#36404a",
  },
});

function FriendBox(props) {
  const { url, status, id, name, message, time, selected, setSelected } = props;
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
      onClick={() => setSelected(id)}
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
          Alex Telles
        </Typography>
        <Typography
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            fontSize: "14px",
          }}
        >
          alo 123 qwdqw dqw dqw dqwd qwd qwd qwd qwd{" "}
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
        12:12
      </Box>
    </CustomButton>
  );
}

export default FriendBox;
