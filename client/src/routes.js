import { Navigate } from "react-router-dom";
import Dashboard from "./layout/dashboard";
import SignUp from "./layout/signup";
import SignIn from "./layout/signin";
import Landing from "./layout/landing";

const routes = (isLoggedIn) => [
  {
    key: "chat-dashboard",
    route: "/dashboard",
    component: isLoggedIn ? <Dashboard /> : <Navigate to="/auth/login" />,
  },
  {
    key: "landing",
    route: "/",
    component: <Landing />,
  },
  {
    key: "login",
    route: "/auth/login",
    component: <SignIn />,
  },
  {
    key: "logout",
    route: "/auth/register",
    component: <SignUp />,
  },
];

export default routes;
