import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import { Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { bcolors, textcolor } from "../../../colors";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function LogoutDialog({ open, setOpen }) {
    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: bcolors.dialog,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: textcolor.white,
                    }}
                >
                    {/* 
            you want to logout ?
            */}
                    {"Are you sure you want to log out?"}
                </DialogTitle>
                <DialogContent>
                    <DialogActions>
                        <Box
                        width={"100%"}
                        display="flex"
                        justifyContent={"space-evenly"}
                        >
                            <Button
                                onClick={() => {
                                    setOpen(false);
                                    // clearForm();
                                }}
                                //   variant="outlined"
                                sx={{
                                    backgroundColor: "#2C8A00",
                                    color: "#E1E9F1",
                                    ":hover": {
                                        opacity: 0.6,
                                        backgroundColor: "#2C8A00",
                                    },
                                    width: "100px",
                                }}
                            >
                                no
                            </Button>
                            <Button
                                sx={{
                                    backgroundColor: "#972400",
                                    color: "#E1E9F1",
                                    ":hover": {
                                        opacity: 0.6,
                                        backgroundColor: "#972400",
                                    },
                                    width: "100px",
                                }}
                                // variant="contained"
                            >
                                yes
                            </Button>
                        </Box>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
}
