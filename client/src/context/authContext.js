import { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { authReducer } from "../reducers/authReducer";
import { useCookies } from "react-cookie";
import setAuthToken from "../utils/setAuthToken";
const AuthContext = createContext();

/**
 * @param { Node } children 
 * @TODO share all state in authentication processing
 */
const AuthContextProvider = ({ children }) => {
  
  // init value of authContext
  // authLoading : it mean we are in authentication process
  // isAuthenticated : it means we are authenticated
  // user : content user information
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
  });

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  /**
   * @public
   * @todo verify token in cookie
   * @returns { Object } user information
   */
  const verify = async () => {
    if (cookies.token) {
      setAuthToken(cookies.token);
    }
    await axios
      .get(`http://localhost:4000/api/auth/verify-token`)
      .then(function (response) {
        if (response.data.successful)
          dispatch({
            type: "VERIFY",
            payload: {
              isAuthenticated: true,
              authLoading: false,
              user: response.data.userInfor,
            },
          });
          console.log("verification successful")
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

  /**
   * @public
   * @todo login with username and password
   * @returns { String } token string
   */
  const loginUser = async (userForm) => {
    const { username, password } = userForm;
    await axios
      .post(`http://localhost:4000/api/auth/login`, {
        email: username,
        password: password,
      })
      // get token and processing
      .then((response) => {
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

  /**
   * @public
   * @todo register new account
   */
  const registerUser = async (userForm) => {
    const { email, username, password } = userForm;

    await axios
      .post(`http://localhost:4000/api/auth/register`, {
        email: email,
        password: password,
        username: username,
      })
      .then((response) => {
        return true;
      })
      .catch((err) => {
        console.log("error : " + err);
        return false;
      });
  };


  const logoutUser = async () => {
    dispatch({type: "LOGOUT"})
  }

  /**
   * @TODO check token whenever have token in cookie and one time at refresh
   */
  useEffect(() => {
    async function checkToken() {
      await verify();
    }
    if (cookies.token) {
      checkToken();
    }
  }, []);

  // Value to share
  const authContextData = {
    loginUser,
    authState,
    verify,
    registerUser,
    logoutUser
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthContextProvider;
