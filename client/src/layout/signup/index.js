import { useState, useContext } from "react";
import Box from "@mui/material/Box";
import InputText from "../../components/inputText";
// import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import { AuthContext } from "../../context/authContext";
import { useNavigate, Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import { checkEmail } from "../../functions";
import logo from "./img/logo.png";
import { bcolors, textcolor } from "../../colors";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

function SignUp() {
  const navigate = useNavigate();
  const handleNavigate = (link) => {
    navigate(link);
  };
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { authState, registerUser } = useContext(AuthContext);

  const [registerForm, setRegisterFrom] = useState({
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
  });
  const { email, username, password, confirmpassword } = registerForm;

  const onChangeRegisterFrom = (event) => {
    setRegisterFrom({
      ...registerForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (checkEmail(registerForm.email)) {
      console.log("correct email");
    } else {
      console.log("incorrect email");
      return;
    }
    if (registerForm.password !== registerForm.confirmpassword) {
      console.log("password mismatch");
      return;
    }
    setIsSubmiting(true);

    let success = await registerUser({
      email: registerForm.email,
      password: registerForm.password,
      username: registerForm.username,
    });
    setIsSubmiting(false);
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
        overflow: "scroll",
      }}
    >
      {authState.isAuthenticated && <Navigate to="/dashboard" replace />}
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
            height={320}
            justifyContent="space-between"
          >
            <InputText
              name="email"
              text={email}
              setText={onChangeRegisterFrom}
              color={textcolor.white}
              title={"email"}
              type="email"
            />
            <InputText
              name="username"
              text={username}
              setText={onChangeRegisterFrom}
              color={textcolor.white}
              title={"username"}
            />
            <InputText
              name="password"
              text={password}
              setText={onChangeRegisterFrom}
              color={textcolor.white}
              title={"password"}
              type="password"
            />
            <InputText
              name="confirmpassword"
              text={confirmpassword}
              setText={onChangeRegisterFrom}
              color={textcolor.white}
              title={"confirm password"}
              type="password"
            />
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
          onClick={handleSignUp}
        >
          {isSubmiting ? (
            <CircularProgress
              variant="indeterminate"
              disableShrink
              size={25}
              thickness={4}
              sx={{
                color: "white",
                animationDuration: "550ms",
              }}
            />
          ) : (
            "Sign up"
          )}
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
