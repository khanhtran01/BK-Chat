import { useState, useContext } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { conversationContext } from "../../context";
import { bcolors, textcolor } from "../../colors";
import React from "react";

// import axios from "axios";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const label = { inputProps: { "aria-label": "Checkbox demo" } };

function SignIn() {
  const { loginUser, authState, verify } = useContext(AuthContext);
  const { getAllContact } = useContext(conversationContext);

  const [alertStatus, setAlertStatus] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertStatus(false);
  };
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [isSubmiting, setIsSubmiting] = useState(false);

  const { username, password } = loginForm;

  const onChangeLoginForm = (event) =>
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });

  const onSubmit = async (event) => {
    console.log(loginForm);
    event.preventDefault();
    setIsSubmiting(true);
    let success = await loginUser(loginForm);
    console.log(success);

    if (success) {
      await verify();
      await getAllContact();
      setIsSubmiting(false);
      navigate("/dashboard");
    } else {
      setAlertStatus(true);
      setIsSubmiting(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit(event);
    }
  };

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
        overflow: "scroll",
      }}
    >
      <Snackbar
        open={alertStatus}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{ width: "100%" }}
        >
          Username or password is invalid
        </Alert>
      </Snackbar>
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
          autoSave="" 
        >
          <Box
            display="flex"
            flexDirection="column"
            height={150}
            justifyContent="space-between"
          >
            <InputText
              color={textcolor.white}
              title={"username"}
              text={username}
              setText={onChangeLoginForm}
              name="username"
              type={"email"}
              autoComplete={"username"}
            />
            <InputText
              name="password"
              color={textcolor.white}
              title={"password"}
              text={password}
              setText={onChangeLoginForm}
              type="password"
              onKeyDown={handleKeyDown} 
              autoComplete="password"
            />
          </Box>
          <Box
            display="flex"
            alignItems="right"
            width="100%"
            justifyContent="flex-end"
            marginTop="10px"
            sx={{
              cursor: "pointer",
            }}
            onClick={() => handleNavigate("/auth/forgotPassword")}
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
            onClick={onSubmit}
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
              "Sign in"
            )}
          </Button>
        </FormControl>
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
