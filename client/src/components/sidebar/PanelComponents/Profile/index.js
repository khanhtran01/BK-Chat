import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CustomizedAccordions from "../../../accordion";
import PersonIcon from "@mui/icons-material/Person";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { AuthContext } from "../../../../context/authContext";
import LongMenu from "../../../menu";
import { textcolor, bcolors } from "../../../../colors";

const menuOptions = [
  {
    component: "Edit",
    handle: () => {},
  },
  {
    component: "Action",
    handle: () => {},
  },
  {
    component: "Another Action",
    handle: () => {},
  },
];

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

function ProfileTab() {
  // fake user data
  const { authState } = useContext(AuthContext);
  const user = {
    name: "Tran Le Viet Khanh",
    age: "21",
    email: "khanh.tran01@hcmut.edu.vn",
    location: "Viet Nam",
  };

  const AboutBox = ({ user }) => {
    return (
      <Box>
        <AboutElement
          marginBottom="1.5rem"
          title="Name"
          content={authState.user.username}
        />
        <AboutElement marginBottom="1.5rem" title="Age" content={user.age} />
        <AboutElement
          marginBottom="1.5rem"
          title="Email"
          content={authState.user.email}
        />
        <AboutElement title="Location" content={user.location} />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        padding: "24px",
        // backgroundColor: "white",
        overflow: "scroll",
      }}
    >
      {/* Header Part */}
      <Box
        sx={{
          fontSize: "1.3125rem",
          fontWeight: 600,
          color: textcolor.primaryGray,
        }}
        display="flex"
        justifyContent="space-between"
      >
        <Typography fontWeight={500} fontSize={"1.3125rem"}>
          My Profile
        </Typography>
        <LongMenu
          icon={<MoreVertIcon sx={{ color: textcolor.primaryGray }} />}
          options={menuOptions}
        />
      </Box>
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
            alt="Remy Sharp"
            src={`${authState.user.avatar}`}
            sx={{ height: "5.375rem", width: "5.375rem" }}
          />
        </Box>
        <Typography
          fontWeight={600}
          marginBottom={0.5}
          marginTop={3}
          color={textcolor.primaryGray}
        >
          {authState.user.username}
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
            {authState.user.desc ? authState.user.desc : "No description"}
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

export default ProfileTab;
