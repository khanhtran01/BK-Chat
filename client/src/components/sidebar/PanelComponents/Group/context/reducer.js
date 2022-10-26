const groupReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "HANDLE_CREATE_POPUP":
      return {
        ...state,
        groupDialog: payload,
      };
    case "OPEN_SELECT_POPUP":
      return {
        ...state,
        groupDialog: false,
        selectMemberPopup: true,
      };
    case "CLOSE_SELECT_POPUP":
      return {
        ...state,
        groupDialog: true,
        selectMemberPopup: false,
      };
    case "SELECT_MEMBER":
      if (state.listMembers[payload.id]) {
        let temp = { ...state.listMembers };
        delete temp[payload.id];
        return {
          ...state,
          listMembers: temp,
        };
      }
      return {
        ...state,
        listMembers: { ...state.listMembers, [payload.id]: payload.username },
      };
    case "REMOVE_MEMBER":
      let temp1 = { ...state.listMembers };
      delete temp1[payload];
      return {
        ...state,
        listMembers: temp1,
      };
    default:
      return { ...state };
  }
};

export { groupReducer };
