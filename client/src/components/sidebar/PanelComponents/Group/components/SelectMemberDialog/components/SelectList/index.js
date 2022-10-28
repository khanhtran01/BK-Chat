import React from "react";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";

// MUI import
import {
  Box,
  FormGroup,
  FormControlLabel,
  Typography,
  Button,
  Dialog,
  DialogActions,
  TextField,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Slide,
} from "@mui/material";

import { groupsContext } from "../../../../context";

import { textcolor } from "../../../../../../../../colors";

import CheckBox from "../CheckBox";

export default function SelectList({ data }) {
  const { groupData, selectMember } = useContext(groupsContext);
  return (
    <Box>
      <FormGroup>
        {data.map((user) => (
          <FormControlLabel
            key={uuidv4()}
            sx={{
              "& .MuiFormControlLabel-label": {
                color: textcolor.white,
              },
            }}
            control={
              <CheckBox
                defaultChecked={groupData.listMembers[user.userId] ? true : false}
                onChange={() => selectMember({id: user.userId, username: user.username})}
              />
            }
            label={user.username}
          />
        ))}
      </FormGroup>
    </Box>
  );
}
