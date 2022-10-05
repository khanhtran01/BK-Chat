import { Navigate } from "react-router-dom";

const Landing = () => {
  return <Navigate replace to="/auth/login" />;
};

export default Landing;
