import * as React from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

// import component MUI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// import icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import SettingsIcon from "@mui/icons-material/Settings";

// import panelTab
import ChatPanel from "./PanelComponents/Chat";

// import from soutce code
import logo from "../../logo/logo.png";
import { bcolors, textcolor } from "../../colors";
// import panelTab

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{
        width: "26.5rem",
      }}
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 3,
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
  const [value, setValue] = React.useState(1);
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
    <SettingsIcon
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
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: "100%",
      }}
    >
      <CustomTabs
        listElements={listElements}
        value={value}
        handleChange={handleChange}
      />
      <TabPanel value={value} index={0}></TabPanel>
      <TabPanel value={value} index={1}>
        <ChatPanel />
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
    </Box>
  );
}
