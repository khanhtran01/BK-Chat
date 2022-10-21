// import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

function InputText(props) {
  const { color, title, text, setText, name, type, onKeyDown } = props;
  const handleKeyDown = event => {
    console.log('User pressed: ', event.key);

    // console.log(message);

    if (event.key === 'Enter') {
      // 👇️ your logic here
      console.log('Enter key pressed ✅');
    }
  };
  return (
    <TextField
      id={uuidv4()}
      label={title.toUpperCase()}
      name={name}
      type={type}
      value={text}
      onChange={setText}
      onKeyDown={handleKeyDown}
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

InputText.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  onKeyDown: PropTypes.func,
};

InputText.defaultProps = {
  type: "text",
  onKeyDown: () => {},
};
