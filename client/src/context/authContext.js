import { createContext, useReducer } from "react";
import axios from "axios";
import { LOCAL_STORAGE_TOKEN_NAME } from "./constant";
import { authReducer } from "../reducers/authReducer";

import setAuthToken from "../utils/setAuthToken";
const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
  });

  // authen user
  const loadUser = async () => {
    if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
      setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
    }
  };

  // login
  const loginUser = async (userForm) => {
    const { username, password } = userForm;
    console.log();
    try {
      await axios
        .post(`http://localhost:4000/api/auth/login`, {
          email: username,
          password: password,
        })
        .then((response) => {
          console.log(response.data);
          dispatch({ type: "LOGIN", payload: response.data });
          localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data._id);
        })
        .catch((err) => {
          console.log("error : " + err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const authContextData = { loginUser, authState };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };
export default AuthContextProvider;
