export const socketReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
      case "TEST":
        return {
          ...state,
        };
      default:
        return "unknown action";
    }
  };
  