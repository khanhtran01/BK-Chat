import axios from "axios";
// import { apiUrl } from "./constant";
import { createContext, useReducer, useEffect, useContext } from "react";
import conversationReducer from "../reducers/conversationReducer";
import { AuthContext } from "./authContext";
// import * as dotenv from "dotenv"
const conversationContext = createContext();

/**
 * @TODO share all state of the conversation and contracts
 * @param { Node } children
 */
function ContextProvider({ children }) {
  const { authState } = useContext(AuthContext);
  // * init value of authContext
  const [userData, dispatch] = useReducer(conversationReducer, {
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
  });

  /**
   * getAllContact
   * @TODO get all contacts
   * @param {}
   * @returns all contact
   */
  const getAllContact = async () => {
    
    let data;
    await axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/api/conversation/get-all-contact`)
      .then((response) => {
        data = response.data.allContact;
        dispatch({ type: "UPDATE_CONTACT", payload: response.data.allContact });
      })
      .catch((err) => {
        console.log(err);
      });
    return data;
  };


  /**
   * getAllNotification
   * @TODO get all notifications
   * @param {}
   * @returns all contact
   */
  const getAllNotify = async () => {
    await axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/api/notification/get`)
      .then((response) => {
        dispatch({ type: "UPDATE_NOTIFY", payload: response.data.notifications });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * initData
   * @param {}
   * @TODO get all contacts and all conversations
   * @returns
   */
  const initData = async () => {
    let data;
    await axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/api/home`)
      .then((response) => {
        dispatch({ type: "INIT_DATA", payload: response.data });
      })
      .catch((err) => {
        console.log(err);
      });
    return data;
  };

  /**
   * addContact
   * @param {Object} formData content : email and message
   * TODO add new contact
   * @returns
   */
  const addContact = async (formData) => {
    let result;
    try {
      const respone = await axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/api/conversation/new-contact`, formData);
      result = respone;
      await initData();
    }
    catch (err) {
      console.error(err)

    }
    return result;
  };

  const createGroup = async (formData) => {
    await axios
      .post(`${process.env.REACT_APP_SERVER_ADDRESS}/api/conversation/new-group`, formData)
      .then((res) => {
        if (res.data.successful) {
          initData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * TODO: add message receive to current conversation
   * @param { Object } data data of message from friend
   */
  const receiveMessage = async (data) => {
    dispatch({ type: "RECEIVE_MESSAGE", payload: data });
    await axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/api/conversation/read-chat?chatId=${data._id}`)
      .catch(err => {
        console.error(err);
      });
  };

  const addToWaitingStack = (data) => {
    dispatch({ type: "ADD_WAIT_LIST", payload: data });
  };

  const selectConversation = async ({ id, name, url, receiverId, type, member, desc }) => {
    if (userData.currConversationId !== id) {
      dispatch({ type: "LOADING_CONVERSATION", payload: true });
      await axios
        .get(`${process.env.REACT_APP_SERVER_ADDRESS}/api/conversation?id=${id}`)
        .then(function (response) {
          dispatch({
            type: "SELECT_CONVERSATION",
            payload: {
              id: id,
              currConversation: response.data.chats,
              chatInfo: {
                conversationId: id,
                name: name,
                avatar: url,
                receiverId: receiverId,
                type: type,
                member: response.data.member,
                desc: desc
              },
              isLoadingConversation: false,
            },
          });
        })
        .catch(function (err) {
        });
    }
  };

  const updateFriendStatus = (onlineList) => {
    let tempList = {};

    // eslint-disable-next-line array-callback-return
    onlineList.map((user) => {
      tempList[user.userId] = true;
    });

    dispatch({ type: "UPDATE_ONLINE_LIST", payload: { ...tempList } });
  };

  const updateOldMessages = (messages) => {
    dispatch({type: "UPDATE_OLD_MESSAGES", payload: { messages } });
  }
  /**
   * Init all contact to load to UI
   */
  useEffect(() => {
    const initContactList = async () => {
      await initData();
      await getAllNotify();
    };
    if (authState.isAuthenticated) {
      initContactList();
    }
  }, [authState.user]);

  const reset_logout = () => {
    dispatch({ type: "RESET_ALL_STATUS" });
  }

  const add_message_fast = (message) => {
    dispatch({ type: "ADD_MESSAGE_FAST", payload: message });
  }
  const out_of_conversation = () => {
    dispatch({ type: "OUT_OF_CONVERSATION"});

  }

  const contextData = {
    addContact,
    getAllContact,
    userData,
    selectConversation,
    updateFriendStatus,
    receiveMessage,
    addToWaitingStack,
    createGroup,
    reset_logout, add_message_fast,
    initData,
    updateOldMessages,
    getAllNotify,
    out_of_conversation
  };
  return (
    <conversationContext.Provider value={contextData}>
      {children}
    </conversationContext.Provider>
  );
}
export { conversationContext };
export default ContextProvider;
