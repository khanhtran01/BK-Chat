const conversationReducer = (state, action) => {
  const { type, payload } = action;
  // console.log("convestationReducer: " + payload);
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
    default:
      return state;
  }
};

export default conversationReducer;
