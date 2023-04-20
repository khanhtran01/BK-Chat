import { createContext, useState } from "react";

const selectMemberContext = createContext()


function SelectContextProvider({ children }) {

    const [selectedMember, setSelectedMember] = useState({});
    return <selectMemberContext.Provider value={{ selectedMember, setSelectedMember }}>
        {children}
    </selectMemberContext.Provider>
}

export default SelectContextProvider;
export { selectMemberContext }