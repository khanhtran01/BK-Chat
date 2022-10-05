export const authReducer = (state, action) => {
  const { type, payload } = action;
  console.log("authReducer: " + type);
  switch (type) {
    case "SET_AUTH":
      return {
        ...state,
      };
    case "LOGIN":
      return { ...state, isAuthenticated: true, user: payload };
    default:
      return "unknown action";
  }
};
