import { createContext, useState } from "react";


const replyContext = createContext();

const ReplyContextProvider = ({ children }) => {
    const [replyFor, setReply] = useState("");


    const value = {
        replyFor,
        setReply
    }
    return <replyContext.Provider
        value={value}>
        {children}
    </replyContext.Provider>

}

export default ReplyContextProvider;
export { replyContext };