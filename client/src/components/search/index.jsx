import * as React from "react";
// import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
// import DirectionsIcon from "@mui/icons-material/Directions";
import PropTypes from "prop-types";

import { bcolors, textcolor } from "../../colors";
// import SelectInput from "@mui/material/Select/SelectInput";

function SearchInput({ placeholder }) {
  return (
    <Box
      sx={{
        p: "2px 4px",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        backgroundColor: bcolors.sidebar,
        borderRadius: 1,
      }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <SearchIcon
          sx={{
            color: textcolor.white,
          }}
        />
      </IconButton>
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          ".MuiInputBase-input": {
            color: `${textcolor.white}`,
          },
        }}
        placeholder={placeholder}
        inputProps={{ "aria-label": "search google maps" }}
      />
    </Box>
  );
}

export default SearchInput;

SearchInput.propTypes = {
  placeholder: PropTypes.string,
};

SearchInput.defaultProps = {
  placeholder: "Search messages or users",
};
