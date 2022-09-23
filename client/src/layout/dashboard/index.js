import { userState, useState } from "react";
import SideBar from "../../components/sidebar";
import ChatBoard from "../../components/chatboard";

import Context from "../../context";
import { clientList } from "./data";
function Dashboard() {
  const currClient = clientList[0];
  const [client, setClient] = useState(currClient.id);
  return (
    <Context.Provider value={[client, setClient]}>
      <div
        style={{
          display: "flex",
          // height: "calc(100%-90px-376px)",
          alignItems: "stretch",
          alignContent: "stretch",
          height: "100%",
        }}
      >
        <SideBar data={clientList} />
        <ChatBoard partner={currClient} />
      </div>
    </Context.Provider>
  );
}

export default Dashboard;
