import React from "react";
import { useContext } from "react";
import { selectMemberContext } from "../context/addMemberContext";
import { v4 as uuidv4 } from "uuid";

// MUI import
import {
  Box,
  FormGroup,
  FormControlLabel,
  Typography,
  Avatar,
} from "@mui/material";

import { textcolor } from "../../../colors";

import CheckBox from "../../sidebar/PanelComponents/Group/components/SelectMemberDialog/components/CheckBox";

export default function SelectList({ data }) {
  //   const { groupData, selectMember } = useContext(groupsContext);
  const { selectedMember, setSelectedMember } = useContext(selectMemberContext);
  // const [selectedMember, setSelectedMember] = useState({});
  const handleSelectMember = (memInfo) => {

    if (selectedMember[memInfo.userId]) {
      let temp = { ...selectedMember };
      delete temp[memInfo.userId];
      setSelectedMember({ ...temp });
    } else {
      setSelectedMember({ ...selectedMember, [memInfo.userId]: memInfo });
    }
  };
  return (
    <Box>
      <FormGroup sx={{ width: "21rem" }}>
        {data.map((user) => (
          <FormControlLabel
            key={uuidv4()}
            sx={{
              "& .MuiFormControlLabel-label": {
                color: textcolor.white,
                flex: 1,
                marginLeft: "-16px",
                marginTop: "8px"
              },
            }}
            control={
              <CheckBox
                defaultChecked={selectedMember[user.userId] ? true : false}
                onChange={() => handleSelectMember(user)}
              />
            }
            labelPlacement="start"
            label={
              <Box
                display={"flex"}
                justifyContent="flex-start"
                alignItems="center"
              >
                {user.avatar ? (
                  <Avatar
                    src={`${user.avatar}`}
                    alt={`${user.username}}`}
                    sx={{
                      width: "35px",
                      height: "35px",
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      backgroundColor: "#7269ef40",
                      color: "rgb(114,105,239)",
                      fontSize: ".9375rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      width: "35px",
                      height: "35px",
                    }}
                  >
                    {user.username ? `${user.username[0]}` : "N"}
                  </Avatar>
                )}
                <Typography
                  sx={{
                    marginLeft: "12px",
                    userSelect: "none",
                  }}
                >
                  {user.username}
                </Typography>
              </Box>
            }
          />
        ))}
      </FormGroup>
    </Box>
  );
}
