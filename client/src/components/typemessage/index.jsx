import * as React from "react";
import { useMemo } from "react";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";

import { bcolors, textcolor } from "../../colors";

export default function InputText({ text, setText, onKeyDown, disabled }) {
  // const inputRef = useRef(null);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     inputRef.current.focus();
  //   }, 100);

  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, []);

  const setFocused = (input) => {
    if(input != null) {
      input.focus();
   }
  }

  const component = useMemo(
    () => (
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
          id="message-input-text"
          sx={{
            ml: 1,
            flex: 1,
            ".MuiInputBase-input": {
              color: `${textcolor.white}`,
            },
          }}
          // ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter Message..."
          inputProps={{ "aria-label": "search google maps" }}
          onKeyDown={onKeyDown}
          disabled={disabled}
          inputRef={setFocused}
        />
      </Box>
    ),
    [text, disabled]
  );
  return component;
}
