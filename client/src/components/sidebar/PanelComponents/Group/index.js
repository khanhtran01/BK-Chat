import { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

// MUI import
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import GroupIcon from "@mui/icons-material/Group";
// import material
import { textcolor, bcolors } from "../../../../colors";
// import components
import SearchInput from "../../../search";
import GroupDialog from "./components/GroupDialog";
import SelectMemberDialog from "./components/SelectMemberDialog";
// import context
import { conversationContext } from "../../../../context";
import { groupsContext } from "./context";
import { Avatar } from "@mui/material";

function Group() {
  const { handleCreateGroup } = useContext(groupsContext);
  const { userData } = useContext(conversationContext);
  return (
    <Box sx={{ height: "100%" }}>
      <GroupDialog />
      <SelectMemberDialog />
      <Box sx={{ height: "10rem", p: 3 }}>
        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
          marginBottom="1.5rem"
        >
          <Typography
            sx={{
              color: textcolor.primaryGray,
              fontSize: "1.3125rem",
            }}
          >
            Groups
          </Typography>
          <Button
            sx={{
              color: textcolor.primaryGray,
            }}
            onClick={() => handleCreateGroup(true)}
          >
            <GroupIcon />
          </Button>
        </Box>
        <SearchInput placeholder={"Search groups..."} />
      </Box>
      <Box
        sx={{
          overflow: "scroll",
          height: "calc(100vh - 180px)",
          padding: "24px",
        }}
      >
        {userData.contactList.map((contact) => {
          if (contact.type === "group") {
            return (
              <Box
                key={uuidv4()}
                display={"flex"}
                alignItems="center"
                padding={"10px"}
              >
                {contact.avatar ? (
                  <Avatar
                    src={`${contact.avatar}`}
                    alt={`${contact.groupName}`}
                    sx={{ marginRight: "10px", height: "32px", width: "32px" }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      marginRight: "10px",
                      height: "32px",
                      width: "32px",
                      backgroundColor: "#7269ef40",
                      color: "rgb(114,105,239)",
                      fontSize: ".9375rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >{`${contact.groupName[0]}`}</Avatar>
                )}
                {/* <Avatar
                  src={contact.avatar}
                  alt={contact.groupName}
                  sx={{
                    marginRight: "10px",
                    height: "32px",
                    width: "32px",
                    backgroundColor: "#7269ef40",
                    color: "rgb(114,105,239)",
                    fontSize: ".9375rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                /> */}
                <Typography sx={{ fontSize: "14px" }} color={"#e1e9f1"}>
                  {"#" + contact.groupName}
                </Typography>
              </Box>
            );
          }
        })}
      </Box>
    </Box>
  );
}

export default Group;
