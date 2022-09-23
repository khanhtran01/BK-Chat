import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { bcolors, textcolor } from "../../colors";
import { v4 as uuidv4 } from "uuid";
import BadgeAvatars from "../avatar";
export default function ActivateList(props) {
  const { data } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "rgba(0,0,0,0)",
        overflow: "hidden",
        overflowX: "scroll",
      }}
    >
      {data.map((person) => {
        if (person.status !== "online") return;
        return (
          <Box
            key={uuidv4()}
            sx={{
              display: "flex",
              backgroundColor: bcolors.sidebar,
              justifyContent: "center",
              alignItems: "center",
              marginTop: "3rem",
              flexDirection: "column",
              textAlign: "center",
              minWidth: "4.3rem",
              maxWidth: "4.3rem",
              height: "3.2rem",
              padding: "0.5rem",
              borderRadius: "0.6rem",
              position: "relative",
              textOverflow: "hidden",
            }}
            mx={1}
          >
            <BadgeAvatars url={person.img} marginTop="-3.1rem" />
            <Box
              sx={{
                width: "100%",
                height: "2rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: "-1.4rem",
              }}
            >
              <Typography
                sx={{
                  color: textcolor.primaryGray,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "left",
                  fontSize: "13px",
                }}
              >
                {person.username}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
