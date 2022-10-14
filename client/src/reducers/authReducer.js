export const authReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_AUTH":
      return {
        ...state,
      };
    case "LOGIN":
      return { ...state, isAuthenticated: true };
    case "GET_USER":
      return { ...state, user: payload };
    case "VERIFY":
      return {
        ...state,
        isAuthenticated: payload.isAuthenticated,
        user: payload.user,
        authLoading: payload.authLoading,
        conversations: payload.conversations,
      };
    default:
      return "unknown action";
  }
};
