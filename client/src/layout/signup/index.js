import { useState } from "react";
import Box from "@mui/material/Box";
import InputText from "../../components/inputText";
// import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";

import logo from "./img/logo.png";
import { bcolors, textcolor } from "../../colors";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

function SignUp() {
  const navigate = useNavigate();
  const handleNavigate = (link) => {
    navigate(link);
  };

  return (
    <Box
      sx={{
        backgroundColor: bcolors.bluedark,
        height: "100%",
        width: "100%",
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
        Sign up
      </Typography>
      <Typography
        sx={{
          color: textcolor.textMuted,
          fontSize: "1rem",
          fontWeight: 400,
          marginTop: "0.6rem",
        }}
      >
        Get your BKChat account now.
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
            height={250}
            justifyContent="space-between"
          >
            <InputText color={textcolor.white} title={"EMAIL"} />
            <InputText color={textcolor.white} title={"USERNAME"} />
            <InputText color={textcolor.white} title={"PASSWORD"} hide />
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
        >
          Sign up
        </Button>
      </Box>
      <Box mt={4} display="flex">
        <Typography color={textcolor.white}>
          Already have an account ?
        </Typography>
        <Typography
          sx={{ marginLeft: "10px", cursor: "pointer" }}
          color={bcolors.main}
          onClick={() => handleNavigate("/auth/login")}
        >
          {" "}
          Signin
        </Typography>
      </Box>
    </Box>
  );
}

export default SignUp;
