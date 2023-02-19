import * as React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { bcolors } from "../../colors";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: bcolors.offline,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

export default function BadgeAvatars(props) {
  const { marginTop, url, status, name } = props;
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        marginTop: marginTop,
      }}
    >
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor:
              status === "online"
                ? bcolors.online
                : status === "offline"
                ? bcolors.offline
                : bcolors.busy,
          },
        }}
      >
        {url ? (
          <Avatar src={`${url}`} alt={`${name}}`} />
        ) : (
          <Avatar
            sx={{
              backgroundColor: "#7269ef40",
              color: "rgb(114,105,239)",
              fontSize: ".9375rem",
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >{`${name[0]}`}</Avatar>
        )}
        {/* <Avatar alt="Remy Sharp" src={url} /> */}
      </StyledBadge>
    </Stack>
  );
}

BadgeAvatars.propTypes = {
  marginTop: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
};

BadgeAvatars.defaultProps = {
  marginTop: "0px",
  url: "",
  type: "badge",
  name: "",
};
