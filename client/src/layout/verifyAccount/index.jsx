import { useState, useContext, useEffect, memo } from "react";
import Box from "@mui/material/Box";
import logo from "./img/logo.png";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useLocation } from "react-router-dom";

import axios from "axios";

import { bcolors, textcolor } from "../../colors";
import React from "react";

// import axios from "axios";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function VerifyAccount() {
  const { authState } = useContext(AuthContext);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [verifyStatus, setVerifyStatus] = useState("inprocess");
  console.log(verifyStatus);
  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/auth/verify-email?email=${email}&token=${token}`
        );
        console.log(response.data);
        if (response.data.successful) {
          setVerifyStatus("successful");
        } else {
          setVerifyStatus("failed");
        }
      } catch (err) {}
    };
    console.log("call verify");
    verify();
  }, []);

  const [alertStatus, setAlertStatus] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertStatus(false);
  };

  const onSubmit = async (event) => {};

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
        boxSizing: "border-box",
        padding: "100px 0px",
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
          Something went wrong
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
        Verify
      </Typography>
      <Typography
        sx={{
          color: textcolor.textMuted,
          fontSize: "1rem",
          fontWeight: 400,
          marginTop: "0.6rem",
        }}
      >
        Verify your email address
      </Typography>

      <Box
        mt={3}
        p={5}
        bgcolor={bcolors.dark}
        sx={{
          width: "300px",
        }}
        borderRadius={1}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {(verifyStatus !== "successful") && <CircularProgress />}

        <Button variant="contained" disabled={verifyStatus !== "successful"} onClick={() => handleNavigate("/auth/login")}>
          Go to Login page
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

export default VerifyAccount;
