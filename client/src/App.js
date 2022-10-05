// import SideBar from "./layout/sidebar";
import Box from "@mui/material/Box";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
// import ProtectedRoute from "./components/protectedRoute";
// import { AuthContext } from "../../context/authContext";
// import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import { useContext } from "react";
import routes from "./routes";
import Dashboard from "./layout/dashboard";
import SignUp from "./layout/signup";
import SignIn from "./layout/signin";
import SideBar from "./components/sidebar";
import Landing from "./layout/landing";
import "./App.css";
function App() {
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
      {isAuthenticated && <SideBar />}
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
