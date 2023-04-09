import Box from "@mui/material/Box";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import { useContext } from "react";
import { useCookies } from "react-cookie";
// import dotenv from "dotenv"
import routes from "./routes";
import "./App.css";
// dotenv.config();
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
  const { isAuthenticated, authLoading } = authState;
  const [cookies] = useCookies(["token"]);

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
          {getRoutes(routes({ isAuthenticated, authLoading, token: cookies.token }))}
          <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
