import { Box, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LongMenu from "../menu";
import { textcolor, bcolors } from "../../colors";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React from 'react'

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

function ContactList({ listFriends }) {
  const [alertStatus, setAlertStatus] = React.useState({
    open: false,
    message: "",
    type: "error",
  });
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertStatus({
      ...alertStatus,
      open: false,
    });
  };
  return (<>
    <Snackbar
      open={alertStatus.open}
      autoHideDuration={6000}
      onClose={handleCloseAlert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleCloseAlert}
        severity="success"
        sx={{ width: "100%",
        color: textcolor.primaryGray,
        backgroundColor:  bcolors.main,
        "& .MuiAlert-icon": {
          color: textcolor.primaryGray,
        }
      }}
      >
        {alertStatus.message}
      </Alert>
    </Snackbar>
    <Box padding="10px 20px">

      {listFriends.map((contact) => (
        <Box
          key={contact.userId}
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
          cursor="pointer"
          color={textcolor.primaryGray}
        >
          <Typography>{contact.username}</Typography>
          <LongMenu
            icon={<MoreVertIcon sx={{ color: textcolor.primaryGray }} />}
            options={[
              {
                component: "Share",
                handle: () => { 
                  navigator.clipboard.writeText(`${contact.email}`)
                  setAlertStatus({
                    open: true,
                    message: "User email has been copied to clipboard",
                    type: "info",
                  })
                },
              },
            ]}
          />
        </Box>
      ))}
    </Box>
  </>
  );
}

export default ContactList;
