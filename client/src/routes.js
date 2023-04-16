import { Navigate } from "react-router-dom";
import Dashboard from "./layout/dashboard";
import SignUp from "./layout/signup";
import SignIn from "./layout/signin";
import Landing from "./layout/landing";
import AuthLoading from "./layout/loading";
import PorgotPassword from "./layout/forgotPassword";
import ChangePassword from "./layout/changePassword";
import VerifyAccount from "./layout/verifyAccount";

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
  {
    key: "forgotPassword",
    route: "/auth/forgotPassword",
    component: <PorgotPassword />,
  },
  {
    key: "resetPassword",
    route: "/auth/reset-password",
    component: <ChangePassword />,
  },
  {
    key: "verifyAccount",
    route: "/auth/verify",
    component: <VerifyAccount />,
  },
];

export default routes;
