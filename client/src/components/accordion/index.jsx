import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { bcolors, textcolor } from "../../colors";
import { v4 as uuidv4 } from "uuid";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  backgroundColor: bcolors.chatboard,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: bcolors.sidebar,
  color: textcolor.white,
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  backgroundColor: bcolors.chatboard,
}));

const CustomizedAccordions = ({ title, description }) => {
  const [tempKey] = React.useState(uuidv4());
  const [expanded, setExpanded] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Accordion
      sx={{
        "& .MuiSvgIcon-root": {
          color: textcolor.white,
        },
        "& .MuiAccordion-root": {
          backgroundColor: "none",
        }
      }}
      expanded={expanded === tempKey}
      onChange={handleChange(tempKey)}
    >
      <AccordionSummary>
        <div>{title}</div>
      </AccordionSummary>
      <AccordionDetails>
        <div>{description}</div>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomizedAccordions;
