import * as React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { bcolors } from "../../colors";

const StyledBadge = styled(Badge)(({ theme, status }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: bcolors.offline,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

export default function BadgeAvatars(props) {
  const { marginTop, url, status } = props;
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
        <Avatar alt="Remy Sharp" src={url} />
      </StyledBadge>
    </Stack>
  );
}

BadgeAvatars.propTypes = {
  marginTop: PropTypes.string,
  url: PropTypes.string.isRequired,
  type: PropTypes.string,
};

BadgeAvatars.defaultProps = {
  marginTop: "0px",
  type: "badge",
};
