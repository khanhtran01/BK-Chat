export const socketReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_ONLINE_LIST":
      return {
        ...state,
        onlineList: payload,
      };
    case "UPDATE_ONLINE_LIST":
      return {
        ...state,
        onlineList: [...state.onlineList, payload],
      };
    case "REMOVE_USER_OFFLINE":
      return {
        ...state,
        onlineList: state.onlineList.filter(
          (user) => user.userId !== payload.userId
        ),
      };
    case "UPDATE_CONVERSATION_ID":
      return {
        ...state,
        currConversationId: payload,
      };
    default:
      return "unknown action";
  }
};
