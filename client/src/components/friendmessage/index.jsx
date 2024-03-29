import { useContext, memo } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { bcolors, textcolor } from "../../colors";
import { styled } from "@mui/material/styles";
import ReplyIcon from "@mui/icons-material/Reply";
import { replyContext } from "../chatboard/context/replyContext";
import Highlighter from "react-highlight-words";

import LongMenu from "../menu";

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
      bottom: "-10px",
      left: "0px",
    },
  },
});

function FriendMessage(props) {
  const { setReply } = useContext(replyContext)
  const { message, time, username, avatar, messageInfo, replyFrom, memList } =
    props;
  const options = [
    { component: <Box>Reply</Box>, handle: () => {
      setReply(messageInfo)
      const input = document.getElementById('message-input-text');
      if (input != null) {
        console.log(input);
        input.focus();
      }
    } },
    { component: <Box>Copy</Box>, handle: () => { navigator.clipboard.writeText(`${message}`) } },
  ];
  // const handles = [reply(message), () => {}]
  return (
    <Box display={"flex"} flexDirection="column" alignItems={"flex-start"}>
      {replyFrom && (
        <>
          <Typography
            sx={{
              color: textcolor.primaryGray,
              textAlign: "left",
              fontSize: ".8375rem",
              opacity: 0.7,
              marginLeft: "50px",
            }}
          >
            <ReplyIcon sx={{ fontSize: ".8375rem", marginRight: "5px" }} />
            {username} replied to {replyFrom.userId.username}'s message
          </Typography>
          <Box
            paddingX={"1rem"}
            paddingBottom={"1.4rem"}
            paddingTop={"0.5rem"}
            marginBottom={"-1.2rem"}
            marginLeft={"50px"}
            width={"fit-content"}
            textAlign={"left"}
            backgroundColor={bcolors.menu}
            borderRadius="8px"
            sx={{
              opacity: 0.7,
            }}
          >
            <Typography
              sx={{
                color: textcolor.primaryGray,
                textAlign: "right",
                fontSize: ".8375rem",
                wordBreak: 'break-all'
              }}
            >
              {replyFrom.content}
            </Typography>
          </Box>
        </>
      )}
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
          {/* <Avatar alt={`${username}`} src={`${avatar}`} /> */}
          {avatar ? (
            <Avatar
              src={`${avatar}`}
              alt={`${username}`}
              sx={{ marginRight: "10px", height: "32px", width: "32px" }}
            />
          ) : (
            <Avatar
              sx={{
                marginRight: "10px",
                height: "32px",
                width: "32px",
                backgroundColor: "#7269ef40",
                color: "rgb(114,105,239)",
                fontSize: ".9375rem",
                fontWeight: 500,
                textTransform: "uppercase",
              }}
            >{`${username[0]}`}</Avatar>
          )}
        </Box>

        <Box>
          <BoxChat
            sx={{
              backgroundColor: bcolors.sidebar,
              padding: "12px 20px",
              borderRadius: "8px 8px 8px 0px",
            }}
          >
            {/* <Typography
              sx={{
                color: textcolor.primaryGray,
                textAlign: "left",
                fontSize: ".9375rem",
              }}
            >
              {message}
            </Typography> */}
            <Highlighter
              highlightStyle={{
                fontWeight: 500,
                backgroundColor: "rgba(0,0,0,0)",
                fontFamily: "Roboto,Helvetica,Arial,sans-serif",
                letterSpacing: "0.00938em",
                color: textcolor.primaryGray,
                textDecoration: "underline",
                wordBreak: 'break-all'

              }}
              unhighlightStyle={{
                color: textcolor.primaryGray,
                textAlign: "left",
                fontSize: ".9375rem",
                fontFamily: "Roboto,Helvetica,Arial,sans-serif",
                letterSpacing: "0.00938em",
                fontWeight: 400,
                wordBreak: 'break-all'

              }}
              searchWords={memList}
              textToHighlight={message}
            />
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
              <AccessTimeIcon
                sx={{ fontSize: "12px", color: textcolor.white }}
              />
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
            {username}
          </Typography>
        </Box>
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
      </Box>
    </Box>
  );
}

export default memo(FriendMessage);