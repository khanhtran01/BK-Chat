import * as React from "react";

// MUI import
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { v4 as uuidv4 } from "uuid";
import { Avatar, Box, Typography } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";


// import PendingIcon from "@mui/icons-material/Pending";
import { bcolors, textcolor } from "../../../../../../colors";
import CustomizedAccordions from "../../../../../accordion";

// import { conversationContext } from "../../../../../../context";
// import { groupsContext } from "../../context";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function NotifyDialog({
  open,
  setOpenDialog,
  members,
  conversationId,
  notifyId,
  topic,
}) {
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenDialog(false)}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: bcolors.dialog,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: textcolor.primaryGray,
          }}
        >
          {"Notify"}
        </DialogTitle>
        <DialogContent>
          <Box>
            <Typography sx={{ color: textcolor.primaryGray }}>
              {`The system proposes to create a subgroup with ${members.length} people from group ${conversationId.name} about topic `}
              <em>{`${topic}`}</em>
            </Typography>
            <Typography
              sx={{ color: textcolor.primaryGray }}
            >{`The list of members includes : `}</Typography>
            <Box>
              <CustomizedAccordions
                title={
                  <Box
                    display={"flex"}
                    justifyContent="center"
                    alignItems={"flex-start"}
                  >
                    <Typography marginLeft={"5px"}>   
                      The list of members includes
                    </Typography>
                  </Box>
                }
                description={
                  <Box
                    sx={{
                      maxHeight: "300px",
                      overflow: "scroll",
                    }}
                  >
                    {members.map((mem) => (
                      <Box
                        key={uuidv4()}
                        display={"flex"}
                        alignItems={"center"}
                        padding={"6px"}
                      >
                        {mem.userId.avatar ? (
                          <Avatar
                            src={`${mem.userId.avatar}`}
                            alt={`${mem.userId.username}}`}
                            sx={{
                              width: "28px",
                              height: "28px",
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              backgroundColor: "#7269ef40",
                              color: "rgb(114,105,239)",
                              fontSize: ".9375rem",
                              fontWeight: 500,
                              textTransform: "uppercase",
                              width: "28px",
                              height: "28px",
                            }}
                          >
                            {mem.userId.username
                              ? `${mem.userId.username[0]}`
                              : "N"}
                          </Avatar>
                        )}
                        <Typography
                          color={textcolor.primaryGray}
                          marginLeft={"10px"}
                        >
                          {mem.userId.username}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                }
              />
            </Box>
          </Box>
          <DialogActions>
            <Button
              onClick={() => {
                // handleSubmitted("reject");
                setOpenDialog(false);
              }}
              variant="outlined"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                // handleSubmitted("accept");
                setOpenDialog(false);
              }}
              variant="contained"
            >
              Create Group Now !
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
