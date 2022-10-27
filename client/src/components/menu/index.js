import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { bcolors, textcolor } from "../../colors";
import { v4 as uuidv4 } from "uuid";
// const options = ["None", "Atria", "Callisto", "Dione"];

const ITEM_HEIGHT = 48;

export default function LongMenu(props) {
  const { icon, options } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton aria-label="more" onClick={handleClick}>
        {icon}
      </IconButton>
      <Menu
        sx={{
          "& .MuiList-root": {
            backgroundColor: bcolors.menu,
          },
          "& .MuiMenuItem-root": {
            color: textcolor.white,
          },
        }}
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={uuidv4()}
            selected={option === "Pyxis"}
            onClick={() => {
              handleClose()
              option.handle()
            }}
          >
            {option.component}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
