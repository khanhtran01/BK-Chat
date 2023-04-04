import { createContext, useReducer } from "react";
import { groupReducer } from "./reducer";
const groupsContext = createContext();

const GroupProvider = ({ children }) => {
  const [groupData, dispatch] = useReducer(groupReducer, {
    selectMemberPopup: false,
    groupDialog: false,
    listMembers: {},
    groupName: "",
    description: "",
    firstMessage: "",
  });

  const handleCreateGroup = (data) => {
    dispatch({ type: "HANDLE_CREATE_POPUP", payload: data });
  };
  const openSelectPopup = () => {
    dispatch({ type: "OPEN_SELECT_POPUP" });
  }
  const closeSelectPopup = () => {
    dispatch({ type: "CLOSE_SELECT_POPUP" });
  }
  const selectMember = (user) => {
    console.log("selectMember");
    dispatch({ type: "SELECT_MEMBER", payload: user });
  }
  const handleGroupName = (event) => {
    dispatch({ type: "GROUP_NAME", payload: event.target.value});
  }
  const handleDescription = (event) => {
    dispatch({ type: "DESCRIPTION", payload: event.target.value});
  }
  const handleFirstMessage = (event) => {
    dispatch({ type: "FIRST_MESSAGE", payload: event.target.value});
  }
  const removeMember = (id) => {
    dispatch({ type: "REMOVE_MEMBER", payload: id });
  }
  const value = {
    groupData,
    handleCreateGroup,
    openSelectPopup,
    closeSelectPopup,
    selectMember,
    removeMember,
    handleGroupName,
    handleDescription,
    handleFirstMessage,
  };

  return (
    <groupsContext.Provider value={value}>{children}</groupsContext.Provider>
  );
};

export { groupsContext };
export default GroupProvider;
