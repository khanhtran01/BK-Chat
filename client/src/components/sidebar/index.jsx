import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

// import component MUI
// import useMediaQuery from "@mui/material/useMediaQuery";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

// import icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
// import NotificationsIcon from "@mui/icons-material/Notifications";
import GroupIcon from "@mui/icons-material/Group";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import Slide from "@mui/material/Slide";

// import panelTab
import ChatPanel from "./PanelComponents/Chat";
import ProfileTab from "./PanelComponents/Profile";
import Contact from "./PanelComponents/Contact";
import Group from "./PanelComponents/Group";
import Notification from "./PanelComponents/Notification";
// import from soutce code
import LogoutDialog from "./Dialog";
import GroupProvider from "./PanelComponents/Group/context";
import ProfileProvider from "./PanelComponents/Profile/context";
import { bcolors, textcolor } from "../../colors";
import { useMediaQuery } from "@mui/material";
// import { context } from "../../layout/dashboard/context";
import { chatboardContext } from "../chatboard/context";
import RecommendIcon from '@mui/icons-material/Recommend';
import React from "react";
// import panelTab

function TabPanel(props) {
  // const matches = useMediaQuery("(min-width:1000px)");
  const { children, value, index, fullScreen, ...other } = props;
  return (
    <div
      style={{
        width: fullScreen ? "100%" : "24.5rem",
        // display: !matches && "none",
      }}
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            backgroundColor: bcolors.bluedark,
            height: "100%",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function CustomTabs(props) {
  const { listElements, value, handleChange, setLogoutDiaglog } = props;
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: bcolors.sidebar,
        color: textcolor.sidedark,
        justifyContent: "space-between",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{
          borderRight: 1,
          borderColor: "divider",

          // height: "100%",
          ".MuiTabs-indicator": {
            backgroundColor: bcolors.main,
          },
          "& .MuiTabs-flexContainer": {
            width: "60px",
          },
          "& .MuiButtonBase-root": {
            minWidth: "0px",
          },
        }}
      >
        {listElements.map((element) => (
          <Tab
            sx={{
              color: "#E1E9F1",

              "&.Mui-selected": {
                color: bcolors.main + " !important",
              },
            }}
            key={uuidv4()}
            icon={element}
          />
        ))}
      </Tabs>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "40px",
          marginBottom: "10px",
          alignItems: "center",
          cursor: "pointer",
          "&:hover > .MuiSvgIcon-root": {
            color: "red",
            // backgroundColor: "red",
          },
        }}
        onClick={() => {
          setLogoutDiaglog(true);
        }}
      >
        <PowerSettingsNewIcon
          sx={{
            width: "1.5rem",
            height: "1.5rem",
            color: "#E1E9F1",
          }}
        />
      </Box>
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function SideBar() {
  const [value, setValue] = useState(1);
  // const { mobileView } = useContext(context);
  const [logoutDialog, setLogoutDiaglog] = useState(false);
  const iconStyle = {
    width: "1.5rem",
    height: "1.5rem",
  };
  const listElements = [
    <AccountCircleIcon sx={iconStyle} />,
    <ChatBubbleIcon sx={iconStyle} />,
    <PermContactCalendarIcon sx={iconStyle} />,
    <GroupIcon sx={iconStyle} />,
    <RecommendIcon sx={iconStyle} />,
  ];
  const mobileView = useMediaQuery("(min-width:1000px)");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { back } = useContext(chatboardContext);
  return (
    <>
      {(mobileView || back) && (
        <Slide direction="right" in={mobileView || back}>
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: back ? "100%" : "unset",
            }}
          >
            <LogoutDialog open={logoutDialog} setOpen={setLogoutDiaglog} />
            <CustomTabs
              listElements={listElements}
              value={value}
              handleChange={handleChange}
              setLogoutDiaglog={setLogoutDiaglog}
            />
            <TabPanel value={value} index={0} fullScreen={back}>
              <ProfileProvider>
                <ProfileTab />
              </ProfileProvider>
            </TabPanel>
            <TabPanel value={value} index={1} fullScreen={back}>
              <ChatPanel />
            </TabPanel>
            <TabPanel value={value} index={2} fullScreen={back}>
              <Contact />
            </TabPanel>
            <TabPanel value={value} index={3} fullScreen={back}>
              <GroupProvider>
                <Group />
              </GroupProvider>
            </TabPanel>
            <TabPanel value={value} index={4} fullScreen={back}>
              <Notification />
            </TabPanel>
            {/* <Box>abcdef</Box> */}
          </Box>
        </Slide>
      )}
    </>
  );
}
