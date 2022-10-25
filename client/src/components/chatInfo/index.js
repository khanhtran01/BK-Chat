import React from "react";
import { useContext } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CustomizedAccordions from "../accordion";
import { textcolor, bcolors } from "../../colors";
import { context } from "../../layout/dashboard/context";
import { conversationContext } from "../../context";

const AboutElement = ({ title, content, marginBottom }) => {
  return (
    <Box boxSizing={"content-box"} marginBottom={marginBottom}>
      <Typography sx={{ color: textcolor.white, fontSize: ".9375rem" }}>
        {title}
      </Typography>
      <Typography sx={{ color: textcolor.primaryGray, fontSize: "0.875rem" }}>
        {content}
      </Typography>
    </Box>
  );
};

export default function ChatInfo() {
  const user = {
    name: "Tran Le Viet Khanh",
    age: "21",
    email: "khanh.tran01@hcmut.edu.vn",
    location: "Viet Nam",
  };
  const { userData } = useContext(conversationContext);
  const { chatInfoPopup } = useContext(context);
  const AboutBox = ({ user }) => {
    return (
      <Box>
        <AboutElement
          marginBottom="1.5rem"
          title="Name"
          content={user.username}
        />
        <AboutElement marginBottom="1.5rem" title="Age" content={user.age} />
        <AboutElement
          marginBottom="1.5rem"
          title="Email"
          content={user.email}
        />
        <AboutElement title="Location" content={user.location} />
      </Box>
    );
  };
  return (
    <Box
      display={chatInfoPopup ? "block" : "none"}
      sx={{
        height: "100%",
        padding: "24px",
        width: "40rem",
        overflow: "scroll",
        backgroundColor: bcolors.bluedark,
      }}
    >
      
      {/* Avatar and name part */}
      <Box display="flex" flexDirection="column" alignItems={"center"}>
        <Box
          height="6.5rem"
          width="6.5rem"
          borderRadius="50%"
          border={"solid 1px #36404a"}
          display="flex"
          justifyContent="center"
          alignItems={"center"}
        >
          <Avatar
            alt={`${userData.chatInfo.name}`}
            src={`${userData.chatInfo.avatar}`}
            sx={{ height: "5.375rem", width: "5.375rem" }}
          />
        </Box>
        <Typography
          fontWeight={600}
          marginBottom={0.5}
          marginTop={3}
          color={textcolor.primaryGray}
        >
          {`${userData.chatInfo.name}`}
        </Typography>
        <Box
          display="flex"
          alignItems={"center"}
          marginBottom={"1.5rem"}
          width="4.188rem"
          justifyContent="space-around"
        >
          <FiberManualRecordIcon
            sx={{ color: bcolors.online, fontSize: "12px" }}
          />
          <Typography color={textcolor.white} fontSize={"1rem"}>
            Active
          </Typography>
        </Box>
      </Box>

      {/* quote and About infomation */}
      <Box>
        <Box borderTop={`solid 1px ${bcolors.sidebar}`} padding="1.5rem 0rem">
          <Typography color={textcolor.white}>
            {user.desc ? user.desc : "No description"}
          </Typography>
        </Box>
        <Box>
          <CustomizedAccordions
            title={
              <Box
                display={"flex"}
                justifyContent="center"
                alignItems={"flex-start"}
              >
                <PersonIcon />
                <Typography marginLeft={"5px"}>About</Typography>
              </Box>
            }
            description={<AboutBox user={user} />}
          />

          <CustomizedAccordions
            title={
              <Box
                display={"flex"}
                justifyContent="center"
                alignItems={"flex-start"}
              >
                <AttachFileIcon />
                <Typography marginLeft={"5px"}>Attact File</Typography>
              </Box>
            }
            description={""}
          />
        </Box>
      </Box>
    </Box>
  );
}
