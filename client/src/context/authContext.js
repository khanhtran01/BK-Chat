import { createContext, useReducer, useState } from "react";
import axios from "axios";
import { apiUrl } from "./constant";
import { authReducer } from "../reducers/authReducer";
const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
  });

  // login
  const loginUser = async (userForm) => {
    const { username, password } = userForm;
    console.log(userForm);
    try {
      await axios
        .post(`${apiUrl}/auth/login`, {
          email: username,
          password: password,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log("error : " + err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const authContextData = { loginUser };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };
export default AuthContextProvider;
