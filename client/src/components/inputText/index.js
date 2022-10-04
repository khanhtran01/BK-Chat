// import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { v4 as uuidv4 } from "uuid";

function InputText(props) {
  const { color, title, hide, text, setText } = props;
  return (
    <TextField
      id={uuidv4()}
      label={title}
      name={title}
      type={hide ? "password" : "text"}
      value={text}
      onChange={setText}
      sx={{
        ".MuiFormLabel-root": {
          color: color,
        },
        ".MuiInputBase-root": {
          color: color,
        },
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: color,
          pointerEvents: "none",
        },
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: "#1976d2",
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccountCircle sx={{ color: "white" }} />
          </InputAdornment>
        ),
      }}
      variant="outlined"
    />
  );
}

export default InputText;
