import { Box, Typography, Avatar } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { bcolors, textcolor } from "../../colors";
import { styled } from "@mui/material/styles";

const BoxChat = styled(Box)({
  "&.MuiBox-root": {
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      width: 0,
      height: 0,
      borderBottom: "25px solid transparent",
      borderLeft: `25px solid ${bcolors.sidebar}`,
      //   backgroundColor: ,
      bottom: "-10px",
      left: "0px",
    },
  },
});

export default function FriendMessage(props) {
  const { message, time } = props;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "24px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          marginRight: "10px",
        }}
      >
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      </Box>

      <Box>
        <BoxChat
          sx={{
            backgroundColor: bcolors.sidebar,
            padding: "12px 20px",
            borderRadius: "8px 8px 8px 0px",
          }}
        >
          <Typography
            sx={{
              color: textcolor.primaryGray,
              textAlign: "left",
              fontSize: ".9375rem",
            }}
          >
            {message}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: textcolor.white,
                fontSize: "12px",
                textAlign: "right",
                marginRight: "5px",
              }}
            >
              {time}
            </Typography>
            <AccessTimeIcon sx={{ fontSize: "12px", color: textcolor.white }} />
          </Box>
        </BoxChat>
        <Typography
          sx={{
            color: textcolor.white,
            textAlign: "left",
            marginTop: "10px",
            fontSize: "14px",
          }}
        >
          Name
        </Typography>
      </Box>
      <Box>
        <MoreVertIcon
          sx={{
            color: bcolors.main,
            fontSize: "20px",
            "&:hover": {
              color: bcolors.white,
            },
            cursor: "pointer",
          }}
        />
      </Box>
    </Box>
  );
}
