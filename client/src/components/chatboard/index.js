import { Box, Typography } from "@mui/material";

import Header from "./header";
import Footer from "./footer";
import Body from "./body";

function ChatBoard(props) {
  const { partner } = props;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

export default ChatBoard;
