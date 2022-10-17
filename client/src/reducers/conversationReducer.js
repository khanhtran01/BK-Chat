const conversationReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "UPDATE_CONTACT":
      return { ...state, contactList: payload };
    case "SELECT_CONVERSATION":
      return {
        ...state,
        currConversationId: payload.id,
        currConversation: payload.currConversation,
        chatInfo: payload.chatInfo,
      };
    case "INIT_DATA":
      return {
        ...state,
        contactList: payload.allContact,
        conversations: payload.conversations,
      }
    case "UPDATE_ONLINE_LIST":
      return {
        ...state,
        onlineList: payload,
      }
    default:
      return state;
  }
};

export default conversationReducer;
