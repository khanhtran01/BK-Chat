import { Box, Typography, Avatar } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import LongMenu from "../menu";
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
      borderRight: `25px solid ${bcolors.sidebar}`,
      //   backgroundColor: ,
      bottom: "-10px",
      right: "0px",
    },
  },
});

export default function MyMessage(props) {
  const options = [<Box>copy</Box>, <Box>delete</Box>];
  const { authState } = useContext(AuthContext)
  const { message, time } = props;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "24px",
      }}
    >
      <Box>
        <LongMenu
          icon={
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
          }
          options={options}
        />
      </Box>
      <Box>
        <BoxChat
          sx={{
            backgroundColor: bcolors.sidebar,
            padding: "12px 20px",
            borderRadius: "8px 8px 0px 8px",
          }}
        >
          <Typography
            sx={{
              color: textcolor.primaryGray,
              textAlign: "right",
              fontSize: ".9375rem",
            }}
          >
            {message}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <AccessTimeIcon sx={{ fontSize: "12px", color: textcolor.white }} />
            <Typography
              sx={{
                color: textcolor.white,
                fontSize: "12px",
                marginLeft: "5px",
              }}
            >
              {time}
            </Typography>
          </Box>
        </BoxChat>
        <Typography
          sx={{
            color: textcolor.white,
            textAlign: "right",
            marginTop: "10px",
            fontSize: "14px",
          }}
        >
          {authState.user.username}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          marginLeft: "10px",
        }}
      >
        <Avatar alt={`${authState.user.username}`} src={`${authState.user.avatar}`} />
      </Box>
    </Box>
  );
}
