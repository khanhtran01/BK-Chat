import SideBar from "../../components/sidebar";
import ChatBoard from "../../components/chatboard";
import ChatInfo from "../../components/chatInfo";
// import MobileBar from "../../components/sidebar/mobileView";
import ChatBoardContextProvider from "../../components/chatboard/context";
import ActionContextProvider from "./context";
import React from "react";
// import { useMediaQuery } from "@mui/material";

function Dashboard() {
  // const { mobileView } = useContext(context);
  // const mobileView = useMediaQuery("(min-width:1000px)");
  // console.log(mobileView);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        alignContent: "stretch",
        height: "100%",
        width: "100%",
      }}
    >
      <ActionContextProvider>
        <ChatBoardContextProvider>
          <SideBar />
          <ChatBoard />
          <ChatInfo />
        </ChatBoardContextProvider>
        {/* {!mobileView && <MobileBar />} */}
      </ActionContextProvider>
    </div>
  );
}

export default Dashboard;
