import SideBar from "../../components/sidebar";
import ChatBoard from "../../components/chatboard";
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
      <SideBar/>
      <ChatBoard />
    </div>
  );
}

export default Dashboard;
