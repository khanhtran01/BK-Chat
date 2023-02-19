import { createContext, useReducer } from "react";
import { ProfileReducer } from "./reducer";

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
    const [profileData, dispatch] = useReducer(ProfileReducer, {
        username: "",
        age: "",
        location: "",
        avatar: {
            name: "",
            file: null,
        },
        openDialog: false,
        description: "",
    })

    const handleDialog = (status) => {
        console.log(status);
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