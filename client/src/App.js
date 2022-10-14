import Box from "@mui/material/Box";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import { useContext, useState } from "react";
import { useEffect, useRef } from "react";

import io from "socket.io-client";
import routes from "./routes";
import "./App.css";

const host = "http://localhost:4000";
const socket = io(host);

function App() {
  const [isConnected, setIsconnected] = useState(false);
  // const socketRef = useRef();
  useEffect(() => {
    socket.on("connect", () => {
      setIsconnected(true);
    });

    socket.on("disconnect", () => {
      setIsconnected(false);
    });
  });

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });
  const { authState } = useContext(AuthContext);
  const { isAuthenticated } = authState;
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
      }}
    >
      <BrowserRouter>
        <Routes>
          {getRoutes(routes(isAuthenticated))}
          <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
