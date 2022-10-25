import { createContext, useState } from "react";

const context = createContext();

function ActionContextProvider ({children}) {
    const [chatInfoPopup, setChatInfoPopup] = useState(false);



    const value = {chatInfoPopup, setChatInfoPopup};

    return (
        <context.Provider value={value}>
            {children}
        </context.Provider>
    )
}
export {context};
export default ActionContextProvider;