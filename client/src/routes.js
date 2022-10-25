import { Navigate } from "react-router-dom";
import Dashboard from "./layout/dashboard";
import SignUp from "./layout/signup";
import SignIn from "./layout/signin";
import Landing from "./layout/landing";
import AuthLoading from "./layout/loading";

const routes = (authState) => [
  {
    key: "chat-dashboard",
    route: "/dashboard",
    component: authState.isAuthenticated ? (
      <Dashboard />
    ) : (authState.authLoading && authState.token) ? (
      <AuthLoading />
    ) : (
      <Navigate to="/auth/login" />
    ),
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
