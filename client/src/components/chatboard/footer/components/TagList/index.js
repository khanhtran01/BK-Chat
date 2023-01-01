import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useContext, useMemo } from "react";
import { styled } from "@mui/material/styles";
import { Button, Box, Avatar } from "@mui/material";

import { chatboardContext } from "../../../context";
import { bcolors, textcolor } from "../../../../../colors";

const CustomButton = styled(Button)(({ theme }) => ({
  width: "100%",
  color: textcolor.primaryGray,
  textTransform: "inherit",
  justifyContent: "flex-start",
}));

export default function TagList() {
  const { messageData, handleTag } = useContext(chatboardContext);
  const data = useMemo(() => {
    return (
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          bottom: "93px",
          alignItems: "flex-start",
          backgroundColor: bcolors.bluedark,
          borderRadius: "8px 8px 0px 0px",
          padding: "5px",
        }}
      >
        {messageData.tagList &&
          messageData.tagList.map((user) => (
            <CustomButton key={uuidv4()} onClick={() => handleTag(user.name)}>
              <Avatar sx={{marginRight: "10px", width: "28px", height: "28px"}} src={user.avatar} alt={user.name} />
              {user.name}
            </CustomButton>
          ))}
      </Box>
    );
  }, [JSON.stringify(messageData.tagList)]);
  return data;
}
