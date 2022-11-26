import { Box, Typography, Avatar } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import LongMenu from "../menu";
import { chatboardContext } from "../chatboard/context";
import { bcolors, textcolor } from "../../colors";
import { styled } from "@mui/material/styles";
import ReplyIcon from "@mui/icons-material/Reply";

import Highlighter from "react-highlight-words";

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
      bottom: "-10px",
      right: "0px",
    },
  },
});

export default function MyMessage(props) {
  const { reply } = useContext(chatboardContext);
  const { message, time, messageInfo, replyFrom, memList } = props;

  const options = [
    { component: <Box>Reply</Box>, handle: () => reply(messageInfo) },
    { component: <Box>Delete</Box>, handle: () => {} },
  ];
  const { authState } = useContext(AuthContext);
  return (
    <>
      <Box display={"flex"} flexDirection="column" alignItems={"flex-end"}>
        {replyFrom && (
          <>
            <Typography
              sx={{
                color: textcolor.primaryGray,
                textAlign: "right",
                fontSize: ".8375rem",
                opacity: 0.7,
                marginRight: "50px",
              }}
            >
              <ReplyIcon sx={{ fontSize: ".8375rem", marginRight: "5px" }} />
              You replied to {replyFrom.userId.username}'s message
            </Typography>
            <Box
              paddingX={"1rem"}
              paddingBottom={"1.4rem"}
              paddingTop={"0.5rem"}
              marginBottom={"-1.2rem"}
              marginRight={"50px"}
              width={"fit-content"}
              textAlign={"right"}
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
            justifyContent: "flex-end",
            marginBottom: "24px",
            position: "relative",
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
              <Highlighter
                highlightStyle={{
                  fontWeight: 500,
                  backgroundColor: "rgba(0,0,0,0)",
                  fontFamily: "Roboto,Helvetica,Arial,sans-serif",
                  letterSpacing: "0.00938em",
                  color: textcolor.primaryGray,
                  textDecoration: "underline",
                }}
                unhighlightStyle={{
                  color: textcolor.primaryGray,
                  textAlign: "right",
                  fontSize: ".9375rem",
                  fontFamily: "Roboto,Helvetica,Arial,sans-serif",
                  letterSpacing: "0.00938em",
                  fontWeight: 400,
                }}
                searchWords={memList}
                textToHighlight={message}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <AccessTimeIcon
                  sx={{ fontSize: "12px", color: textcolor.white }}
                />
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
            {/* <Avatar
              alt={`${authState.user.username}`}
              src={`${authState.user.avatar}`}
            /> */}
            {authState.user.avatar ? (
              <Avatar
                src={`${authState.user.avatar}`}
                alt={`${authState.user.username}`}
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
              >{`${authState.user.username[0]}`}</Avatar>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
