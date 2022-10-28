export const chatboardReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "TYPE_MESSAGE":
      return {
        ...state,
        message: payload,
      };
    case "SET_REPLY":
      return {
        ...state,
        replyFor: payload,
      };
    case "CLEAR_REPLY":
      return {
        ...state,
        replyFor: "",
      };
    case "RESET":
      return {
        message: "",
        replyFor: "",
      }
    default:
      return "unknown action";
  }
};
