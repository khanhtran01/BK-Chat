export const socketReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
      case "UPDATE_ONLINE_LIST":
        return {
          ...state,
          onlineList: payload,
        };
      default:
        return "unknown action";
    }
  };
  