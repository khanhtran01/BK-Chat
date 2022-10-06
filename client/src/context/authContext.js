import { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { authReducer } from "../reducers/authReducer";
import { useCookies } from "react-cookie";
import setAuthToken from "../utils/setAuthToken";
const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
  });

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  // verify token when reload dashboard page
  const verify = async () => {
    if (cookies.token) {
      setAuthToken(cookies.token);
    }
    console.log("verify token");
    await axios
      .get(`http://localhost:4000/api/`)
      .then(function (response) {
        dispatch({
          type: "VERIFY",
          payload: {
            isAuthenticated: true,
            authLoading: false,
            user: response.data.userInfor,
          },
        });
      })
      .catch(function (error) {
        removeCookie("token", { path: "/" });
        setAuthToken(null);
        dispatch({
          type: "VERIFY",
          payload: { isAuthenticated: false, user: null },
        });
      });
  };

  useEffect(() => {
    async function checkToken() {
      await verify();
    }
    checkToken();
  }, []);

  // get user information
  const getUserInfo = async () => {
    try {
      await axios.get(`http://localhost:4000/api/`).then(function (response) {
        console.log(response.data);
        if (response.data) {
          dispatch({ type: "GET_USER", payload: response.data.userInfor });
        }
        return true;
      });
    } catch (err) {
      console.error("get User Infor: Catch Error" + err);
      return false;
    }
  };

  // login
  const loginUser = async (userForm) => {
    const { username, password } = userForm;
    console.log();

    await axios
      .post(`http://localhost:4000/api/auth/login`, {
        email: username,
        password: password,
      })
      // get token and processing
      .then((response) => {
        console.log(response.data);
        dispatch({ type: "LOGIN", payload: response.data });
        // localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data._id);
        setCookie("token", response.data.token, { path: "/" });
        setAuthToken(response.data.token);
        return true;
      })
      .catch((err) => {
        console.log("error : " + err);
        return false;
      });
  };

  const authContextData = { loginUser, authState, getUserInfo, verify };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };
export default AuthContextProvider;
