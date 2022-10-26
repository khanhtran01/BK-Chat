import { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

// MUI import
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import GroupIcon from "@mui/icons-material/Group";
// import material
import { textcolor, bcolors } from "../../../../colors";
// import components
import SearchInput from "../../../search";
import GroupDialog from "./components/GroupDialog";
import SelectMemberDialog from "./components/SelectMemberDialog";
// import context
import { groupsContext } from "./context";

function Group() {
  const { handleCreateGroup } = useContext(groupsContext);
  return (
    <Box sx={{ height: "100%" }}>
      <GroupDialog />
      <SelectMemberDialog />
      <Box sx={{ height: "10rem", p: 3 }}>
        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
          marginBottom="1.5rem"
        >
          <Typography
            sx={{
              color: textcolor.primaryGray,
              fontSize: "1.3125rem",
            }}
          >
            Groups
          </Typography>
          <Button
            sx={{
              color: textcolor.primaryGray,
            }}
            onClick={() => handleCreateGroup(true)}
          >
            <GroupIcon />
          </Button>
        </Box>
        <SearchInput placeholder={"Search groups..."} />
      </Box>
      <Box
        sx={{
          overflow: "scroll",
          height: "calc(100vh - 180px)",
          padding: "24px",
        }}
      ></Box>
    </Box>
  );
}

export default Group;
