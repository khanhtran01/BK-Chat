import { createContext, useReducer } from "react";
import { groupReducer } from "./reducer";

const groupsContext = createContext();

const GroupProvider = ({ children }) => {
  const [groupData, dispatch] = useReducer(groupReducer, {
    selectMemberPopup: false,
    groupDialog: false,
    listMembers: {},
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
    dispatch({ type: "SELECT_MEMBER", payload: user });
  }
  const removeMember = (id) => {
    console.log(id);
    dispatch({ type: "REMOVE_MEMBER", payload: id });
  }
  const value = {
    groupData,
    handleCreateGroup,
    openSelectPopup,
    closeSelectPopup,
    selectMember,
    removeMember
  };

  return (
    <groupsContext.Provider value={value}>{children}</groupsContext.Provider>
  );
};

export { groupsContext };
export default GroupProvider;
