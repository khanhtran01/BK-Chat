import * as React from "react";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BadgeAvatars from "../avatar";
export default function ActivateList() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "rgba(0,0,0,0)" }}>
      <Box
        sx={{
          width: "4.3rem",
          height: "2rem",
          backgroundColor: "rgba(255,255,255,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "3rem",
        }}
        mx={0.5}
      >
        <BadgeAvatars marginTop="-2rem" />
      </Box>
      <Box
        sx={{
          width: "4.3rem",
          height: "2rem",
          backgroundColor: "rgba(255,255,255,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "3rem",
        }}
        mx={0.5}
      >
        <BadgeAvatars marginTop="-2rem" />
      </Box>
      <Box
        sx={{
          width: "4.3rem",
          height: "2rem",
          backgroundColor: "rgba(255,255,255,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "3rem",
        }}
        mx={0.5}
      >
        <BadgeAvatars marginTop="-2rem" />
      </Box>
      <Box
        sx={{
          width: "4.3rem",
          height: "2rem",
          backgroundColor: "rgba(255,255,255,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "3rem",
        }}
        mx={0.5}
      >
        <BadgeAvatars marginTop="-2rem" />
      </Box>
      <Box
        sx={{
          width: "4.3rem",
          height: "2rem",
          backgroundColor: "rgba(255,255,255,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "3rem",
        }}
        mx={0.5}
      >
        <BadgeAvatars marginTop="-2rem" />
      </Box>
    </Box>
  );
}
