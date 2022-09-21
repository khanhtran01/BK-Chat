import { useState } from "react";
import Box from "@mui/material/Box";
import logo from "./img/logo.png";
import Typography from "@mui/material/Typography";
import InputText from "../../components/inputText";
// import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";

import { bcolors, textcolor } from "../../colors";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

function SignIn() {
  const navigate = useNavigate();
  const handleNavigate = (link) => {
    navigate(link);
  };
  return (
    <Box
      sx={{
        backgroundColor: bcolors.bluedark,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img
        style={{
          height: "100px",
        }}
        src={logo}
        alt="logo"
      />
      <Typography
        sx={{
          color: textcolor.primaryGray,
          fontSize: "1.3125rem",
          fontWeight: 600,
        }}
      >
        Sign in
      </Typography>
      <Typography
        sx={{
          color: textcolor.textMuted,
          fontSize: "1rem",
          fontWeight: 400,
          marginTop: "0.6rem",
        }}
      >
        Sign in to continue to BK Chat.
      </Typography>

      <Box
        mt={3}
        p={5}
        bgcolor={bcolors.dark}
        sx={{
          width: "550px",
        }}
        borderRadius={1}
      >
        <FormControl
          sx={{
            width: "100%",
          }}
          variant="standard"
        >
          <Box
            display="flex"
            flexDirection="column"
            height={150}
            justifyContent="space-between"
          >
            <InputText color={textcolor.white} title={"USERNAME"} />
            <InputText color={textcolor.white} title={"PASSWORD"} hide />
          </Box>
          <Box
            display="flex"
            alignItems="right"
            width="100%"
            justifyContent="flex-end"
            marginTop="10px"
          >
            <Typography color={textcolor.white}>Forgot password?</Typography>
          </Box>
          <FormGroup>
            <FormControlLabel
              sx={{
                marginTop: "1rem",

                ".MuiFormControlLabel-label": {
                  color: bcolors.white,
                },
                color: `${textcolor.white} !important`,
              }}
              control={
                <Checkbox
                  {...label}
                  defaultChecked
                  sx={{
                    color: textcolor.white,
                    "&.Mui-checked": {
                      color: bcolors.main,
                    },
                  }}
                />
              }
              label="Remember me"
            />
          </FormGroup>
        </FormControl>
        <Button
          sx={{
            width: "100%",
            height: "40px",
            marginTop: "1rem",
            backgroundColor: bcolors.main,
            "&.MuiButton-root:hover": {
              backgroundColor: bcolors.secondary,
            },
          }}
          variant="contained"
          onClick={() => handleNavigate("/")}
        >
          Sign in
        </Button>
      </Box>
      <Box mt={4} display="flex">
        <Typography color={textcolor.white}>Don't have account? </Typography>
        <Typography
          sx={{ marginLeft: "10px", cursor: "pointer" }}
          color={bcolors.main}
          onClick={() => handleNavigate("/auth/register")}
        >
          {" "}
          Signup now
        </Typography>
      </Box>
    </Box>
  );
}

export default SignIn;
