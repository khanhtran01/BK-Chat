const conversationReducer = (state, action) => {
  const { type, payload } = action;
  // console.log("convestationReducer: " + payload);
  switch (type) {
    case "UPDATE_CONTACT":
      return { ...state, contactList: payload };
    default:
      return state;
  }
};

export default conversationReducer;
