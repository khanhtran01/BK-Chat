import { useState, useContext } from "react";
import Box from "@mui/material/Box";
import logo from "./img/logo.png";
import Typography from "@mui/material/Typography";
import InputText from "../../components/inputText";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { bcolors, textcolor } from "../../colors";
import React from "react";



function PorgotPassword() {
  const { authState } = useContext(AuthContext);

  const [loginForm, setLoginForm] = useState({
    email: "",
  });
  const navigate = useNavigate();
  const handleNavigate = (link) => {
    navigate(link);
  };
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { email } = loginForm;

  const onChangeLoginForm = (event) =>
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmiting(true);

    setIsSubmiting(false);
    navigate("/auth/changePassword");
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
        Forgot password
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
            height={75}
            justifyContent="space-between"
          >
            <InputText
              color={textcolor.white}
              title={"email"}
              text={email}
              onKeyDown={handleKeyDown}
              setText={onChangeLoginForm}
              name="email"
            />
          </Box>
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
            "Reset password"
          )}
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

export default PorgotPassword;