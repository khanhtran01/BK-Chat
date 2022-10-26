import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { textcolor } from "../../../../../../../../colors";

const BootstrapButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 12,
  padding: "6px 12px",
  border: "1px solid",
  lineHeight: 1.5,
  backgroundColor: "#36404a",
  borderColor: "#36404a",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    backgroundColor: "rgba(54,64,74,0.75)",
    borderColor: "rgba(54,64,74,0.75)",
    boxShadow: "none",
  },
  "&:focus": {
    boxShadow: `0 0 0 0.1rem ${textcolor.white}`,
  },
});

export default function SelectButton({ children, onClick }) {
  return (
    <BootstrapButton onClick={onClick} variant="contained" disableRipple>
      {children}
    </BootstrapButton>
  );
}
