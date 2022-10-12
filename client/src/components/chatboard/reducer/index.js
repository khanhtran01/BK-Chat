export const chatboardReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "TYPE_MESSAGE":
      return {
        ...state,
        message: payload,
      };
    default:
      return "unknown action";
  }
};
