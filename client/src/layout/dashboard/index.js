import SideBar from "../../components/sidebar";
import ChatBoard from "../../components/chatboard";
import ChatInfo from "../../components/chatInfo";
import ActionContextProvider from "./context";
function Dashboard() {
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
        <SideBar />
        <ChatBoard />
        <ChatInfo />
      </ActionContextProvider>
    </div>
  );
}

export default Dashboard;
