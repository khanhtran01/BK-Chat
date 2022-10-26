import React from "react";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import ClearIcon from "@mui/icons-material/Clear";

import { bcolors } from "../../../../../../../../colors";
import { groupsContext } from "../../../../context";

export default function ListMember() {
  const { groupData, removeMember } = useContext(groupsContext);
  console.log(Object.values(groupData.listMembers));
  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap={"wrap"}
      marginBottom="4px"
    >
      {Object.keys(groupData.listMembers).map((user) => (
        <Box
          key={uuidv4()}
          sx={{
            display: "flex",
            flexDirection: "row",
            padding: "3px 10px",
            marginX: "2px",
            marginBottom: "4px",
            backgroundColor: bcolors.main,
            alignItems: "center",
          }}
        >
          <Typography>{groupData.listMembers[user]}</Typography>
          <div
            style={{ display: "flex", alignItems: "center" }}
            onClick={() => removeMember(user)}
          >
            <ClearIcon sx={{ fontSize: "20px" }} />
          </div>
        </Box>
      ))}
    </Box>
  );
}
