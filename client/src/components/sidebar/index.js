import { useState } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

// import component MUI
import useMediaQuery from "@mui/material/useMediaQuery";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

// import icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from '@mui/icons-material/Notifications';
import GroupIcon from "@mui/icons-material/Group";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
// import panelTab
import ChatPanel from "./PanelComponents/Chat";
import ProfileTab from "./PanelComponents/Profile";
import Contact from "./PanelComponents/Contact";
import Group from "./PanelComponents/Group";
import Notification from "./PanelComponents/Notification";
// import from soutce code
import GroupProvider from "./PanelComponents/Group/context";
import { bcolors, textcolor } from "../../colors";
// import panelTab

function TabPanel(props) {
  const matches = useMediaQuery("(min-width:1000px)");
  const { children, value, index, ...other } = props;
  return (
    <div
      style={{
        width: "24.5rem",
        display: !matches && "none",
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
  const { listElements, value, handleChange } = props;
  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={value}
      onChange={handleChange}
      aria-label="Vertical tabs example"
      sx={{
        borderRight: 1,
        borderColor: "divider",
        backgroundColor: bcolors.sidebar,
        color: textcolor.sidedark,
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
            "&.Mui-selected": {
              color: bcolors.main,
            },
          }}
          key={uuidv4()}
          icon={element}
        />
      ))}
    </Tabs>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function SideBar() {
  const [value, setValue] = useState(1);
  const listElements = [
    <AccountCircleIcon
      sx={{
        width: "1.5rem",
        height: "1.5rem",
      }}
    />,
    <ChatBubbleIcon
      sx={{
        width: "1.5rem",
        height: "1.5rem",
      }}
    />,
    <PermContactCalendarIcon
      sx={{
        width: "1.5rem",
        height: "1.5rem",
      }}
    />,
    <GroupIcon
      sx={{
        width: "1.5rem",
        height: "1.5rem",
      }}
    />,
    <NotificationsIcon
      sx={{
        width: "1.5rem",
        height: "1.5rem",
      }}
    />,
  ];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
      }}
    >
      <CustomTabs
        listElements={listElements}
        value={value}
        handleChange={handleChange}
      />
      <TabPanel value={value} index={0}>
        <ProfileTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ChatPanel />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Contact />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <GroupProvider>
          <Group />
        </GroupProvider>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Notification />
      </TabPanel>
    </Box>
  );
}
