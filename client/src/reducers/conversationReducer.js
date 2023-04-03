const conversationReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "UPDATE_CONTACT":
      return { ...state, contactList: payload, isLoadingContact: true };
    case "SELECT_CONVERSATION":
      let temp = [...state.conversations];
      for (let i = 0; i < temp.length; i++) {
        if (temp[i]._id === payload.id) {
          temp[i].numUnRead = 0;
          break;
        }
      }
      return {
        ...state,
        currConversationId: payload.id,
        currConversation: payload.currConversation,
        chatInfo: payload.chatInfo,
        isLoadingConversation: payload.isLoadingConversation,
      };
    case "INIT_DATA":
      return {
        ...state,
        contactList: payload.allContact,
        conversations: payload.conversations,
        isLoadingContact: false,
      };
    case "UPDATE_ONLINE_LIST":
      return {
        ...state,
        onlineList: payload,
      };
    case "UPDATE_NOTIFY":
      return {
        ...state,
        notifyList: payload,
      };

    case "RECEIVE_MESSAGE":
      let head1 = {};
      for (let i = 0; i < state.conversations.length; i++) {
        if (state.conversations[i]._id === payload.conversationId) {
          head1 = state.conversations[i];
          break;
        }
      }
      let remain1 = state.conversations.filter(
        (conversation) => conversation._id !== payload.conversationId
      );
      head1.lastChat._id = payload._id;
      head1.lastChat.content = payload.content;
      head1.updatedAt = payload.createAt;
      if (payload.conversationId !== state.currConversationId) {
        head1.numUnRead += 1;
      }
      let newConversations1 = [head1, ...remain1];


      let newCurrConversation = [...state.currConversation];
      console.log(payload);
      for (let i = state.currConversation.length - 1; i >= 0; i--) {
        if (state.currConversation[i]["createdAt"] === payload.createdAt) {
          // console.log("matching ..............................")
          newCurrConversation[i].verify = true;
          newCurrConversation[i]._id = payload._id;
          break;
        }
      }
      // console.log(newCurrConversation);
      return {
        ...state,
        currConversation: newCurrConversation,
        conversations: newConversations1,
      };
    case "ADD_WAIT_LIST":
      let head = {};
      for (let i = 0; i < state.conversations.length; i++) {
        if (state.conversations[i]._id === payload.conversationId) {
          head = state.conversations[i];
        }
      }
      let remain = state.conversations.filter(
        (conversation) => conversation._id !== payload.conversationId
      );
      if (
        head.lastChat._id !== payload._id &&
        payload.conversationId !== state.currConversationId
      ) {
        head.numUnRead += 1;
      }
      head.lastChat._id = payload._id;
      head.lastChat.content = payload.content;
      head.updatedAt = payload.createAt;
      let newConversations = [head, ...remain];
      return {
        ...state,
        conversations: newConversations,
      };
    case "LOADING_CONVERSATION":
      return {
        ...state,
        isLoadingConversation: payload,
      };
    case "RESET_ALL_STATUS":
      return {
        ...state,
        contactList: [], // contant list of contacts
        conversations: [], // contant list of conversations
        currConversationId: "", // contant id of current conversation
        currConversation: [], // contant all chats of current conversation
        waitingList: {}, // contant an object with key is a conversation
        chatInfo: {}, // all chat info of current conversation
        onlineList: {}, // contant an object with key is a friend online and value is true
        notifyList: [],
        isLoadingConversation: false,
        isLoadingContact: true,
      };

    case "ADD_MESSAGE_FAST":
      return {
        ...state,
        currConversation: [...state.currConversation, payload]
      };
    case "UPDATE_OLD_MESSAGES":
      return {
        ...state,
        currConversation: [...payload.messages, ...state.currConversation]
      };
    default:
      return state;
  }
};

export default conversationReducer;
