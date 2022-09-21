// import SideBar from "./layout/sidebar";
import Box from "@mui/material/Box";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Dashboard from "./layout/dashboard";
import SignUp from "./layout/signup";
import SignIn from "./layout/signin";
import "./App.css";
function App() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth/login" element={<SignIn />} />
          <Route path="/auth/register" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
