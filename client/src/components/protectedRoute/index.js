import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { authState } = useContext(AuthContext);
  const { isAuthenticated } = authState;

  return (
    <Route
      {...rest}
      element={
        !isAuthenticated ? <Navigate to="/auth/login" replace /> : Component
      }
    />
  );
};

export default ProtectedRoute;
