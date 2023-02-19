// import { bcolors, textcolor } from "../../../colors";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/material";

function BtnIcon({ icon, onClick }) {
  return (
    <Box
      sx={{
        width: "70px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <IconButton onClick={onClick}>{icon}</IconButton>
    </Box>
  );
}

export default BtnIcon;
