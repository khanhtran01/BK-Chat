import { useState, useContext } from "react";
import Box from "@mui/material/Box";
import logo from "./img/logo.png";
import Typography from "@mui/material/Typography";
import InputText from "../../components/inputText";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { bcolors, textcolor } from "../../colors";
import React from "react";

// import axios from "axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function ChangePassword() {
  const { authState } = useContext(AuthContext);

  const [loginForm, setLoginForm] = useState({
    newPassword: "",
    reNewPassword: "",
  });

  const [alertStatus, setAlertStatus] = useState({
    open: false,
    message: "",
    type: "error",
  });
  const navigate = useNavigate();
  const handleNavigate = (link) => {
    navigate(link);
  };
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { newPassword, reNewPassword } = loginForm;

  const onChangeLoginForm = (event) =>
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });

  const onSubmit = async (event) => {
    event.preventDefault();
    if (isComplete) {
      navigate('/auth/login');
      return;
    }
    if (loginForm.newPassword !== loginForm.reNewPassword) {
      setAlertStatus({
        open: true,
        message: 'retype password not match',
        type: "error",
      });

      return;
    }
    setIsSubmiting(true);


    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/api/auth/reset-password`, {
        email: email,
        password: newPassword,
        token: token
      })
      console.log(loginForm.password)
      if (response.data.successful) {
        setAlertStatus({
          open: true,
          message: response.data.message,
          type: "success",
        });
        setIsComplete(true)
      } else {
        setAlertStatus({
          open: true,
          message: response.data.message,
          type: "error",
        });
      }
    }
    catch (err) {
      setAlertStatus({
        open: true,
        message: err,
        type: "error",
      });
    }
    setIsSubmiting(false);
    // navigate("/auth/changePassword");
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertStatus({
      ...alertStatus,
      open: false,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit(event);
    }
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
        boxSizing: "border-box",
        padding: "100px 0px",
      }}
    >

      <Snackbar
        open={alertStatus.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertStatus.type}
          sx={{ width: "100%" }}
        >
          {alertStatus.message}
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
        Change Password
      </Typography>
      <Typography
        sx={{
          color: textcolor.textMuted,
          fontSize: "1rem",
          fontWeight: 400,
          marginTop: "0.6rem",
        }}
      >
        Please enter your email to retrieve your password
      </Typography>

      <Box
        mt={3}
        p={5}
        bgcolor={bcolors.dark}
        sx={{
          width: "90%",
          maxWidth: "550px",
        }}
        borderRadius={1}
      >
        {!isComplete && <FormControl
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
            <InputText
              color={textcolor.white}
              type={'password'}
              title={"new password"}
              text={newPassword}
              onKeyDown={handleKeyDown}
              setText={onChangeLoginForm}
              name="newPassword"
            />
            <InputText
              color={textcolor.white}
              type={'password'}
              title={"re-type new password"}
              text={reNewPassword}
              onKeyDown={handleKeyDown}
              setText={onChangeLoginForm}
              name="reNewPassword"
            />
          </Box>
        </FormControl>}

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
          {isComplete && "Go back to Login page"}
          {!isComplete && (isSubmiting ? (
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
            "Reset password"
          ))}
        </Button>
      </Box>
      <Box mt={4} display="flex">
        <Typography color={textcolor.white}>Already have an account ? </Typography>
        <Typography
          sx={{ marginLeft: "10px", cursor: "pointer" }}
          color={bcolors.main}
          onClick={() => handleNavigate("/auth/signin")}
        >
          {" "}
          Signin
        </Typography>
      </Box>
    </Box>
  );
}

export default ChangePassword;
