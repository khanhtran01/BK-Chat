import { createContext, useState } from "react";
import { useMediaQuery } from "@mui/material";
const context = createContext();

function ActionContextProvider ({children}) {
    const [chatInfoPopup, setChatInfoPopup] = useState(false);
    const mobileView = useMediaQuery("(min-width:1000px)");


    const value = {chatInfoPopup, setChatInfoPopup, mobileView : !mobileView};

    return (
        <context.Provider value={value}>
            {children}
        </context.Provider>
    )
}
export {context};
export default ActionContextProvider;