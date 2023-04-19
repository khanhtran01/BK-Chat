import { createContext, useReducer, useContext } from "react";
import { AuthContext } from "../../../../../context/authContext";
import { ProfileReducer } from "./reducer";

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
    const {authState} = useContext(AuthContext);
    const [profileData, dispatch] = useReducer(ProfileReducer, {
        username: authState.user?.username,
        location: authState.user?.address,
        avatar: {
            name: "",
            file: null,
        },
        openDialog: false,
        description: authState.user?.desc,
    })

    const handleDialog = (status) => {
        dispatch({ type: "HANDLE_DIALOG", payload: status })
    }
    const handleUsername = (username) => {
        dispatch({ type: "HANDLE_USERNAME", payload: username })
    }
    const handleAge = (age) => {
        dispatch({ type: "HANDLE_AGE", payload: age })
    }
    const handleLocation = (location) => {
        dispatch({ type: "HANDLE_LOCATION", payload: location })
    }
    const handleDescription = (description) => {
        dispatch({ type: "HANDLE_DESCRIPTION", payload: description })
    }
    const handleAvatar = (avatar) => {
        dispatch({ type: "HANDLE_AVATAR", payload: avatar })
    }
    const value = {
        profileData,
        handleDialog,
        handleUsername,
        handleAge,
        handleLocation,
        handleDescription,
        handleAvatar,
    }
    return <ProfileContext.Provider value={value}> {children}</ProfileContext.Provider>
}

export { ProfileContext };
export default ProfileProvider;