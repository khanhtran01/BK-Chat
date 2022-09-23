import * as React from "react";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";

import { bcolors, textcolor } from "../../colors";

export default function InputText({ text, setText }) {
  console.log(text);
  return (
    <Box
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        backgroundColor: bcolors.sidebar,
        borderRadius: 1,
      }}
    >
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          ".MuiInputBase-input": {
            color: `${textcolor.white}`,
          },
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter Message..."
        inputProps={{ "aria-label": "search google maps" }}
      />
    </Box>
  );
}
