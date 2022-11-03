import axios from "axios";
import { apiUrl } from "./constant";
import { createContext, useReducer, useEffect, useContext } from "react";
import conversationReducer from "../reducers/conversationReducer";
import { AuthContext } from "./authContext";

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
      .get(`${apiUrl}/conversation/get-all-contact`)
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
   * initData
   * @param {}
   * @TODO get all contacts and all conversations
   * @returns
   */
  const initData = async () => {
    let data;
    await axios
      .get(`${apiUrl}/home`)
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
    await axios
      .post(`${apiUrl}/conversation/new-contact`, formData)
      .then((response) => {
        result = response;
        initData();
      })
      .catch((err) => {
        console.error(err);
      });
    return result;
  };

  const createGroup = async (formData) => {
    await axios
      .post(`${apiUrl}/conversation/new-group`, formData)
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
      .get(`${apiUrl}/conversation/read-chat?chatId=${data._id}`)
      .catch(err => {
        console.error(err);
      });
  };

  const addToWaitingStack = (data) => {
    dispatch({ type: "ADD_WAIT_LIST", payload: data });
  };

  const selectConversation = async ({ id, name, url, receiverId, type, member }) => {
    if (userData.currConversationId !== id) {
      dispatch({type: "LOADING_CONVERSATION", payload: true});
      await axios
        .get(`${apiUrl}/conversation?id=${id}`)
        .then(function (response) {
          dispatch({
            type: "SELECT_CONVERSATION",
            payload: {
              id: id,
              currConversation: response.data.chats,
              chatInfo: {
                name: name,
                avatar: url,
                receiverId: receiverId,
                type: type,
                member: member,
              },
              isLoadingConversation: false,
            },
          });
        })
        .catch(function (err) {
          console.log("lỗi API get conversation?id");
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

  /**
   * Init all contact to load to UI
   */
  useEffect(() => {
    const initContactList = async () => {
      await initData();
    };
    if (authState.isAuthenticated) {
      initContactList();
    }
  }, [authState.user]);

  const contextData = {
    addContact,
    getAllContact,
    userData,
    selectConversation,
    updateFriendStatus,
    receiveMessage,
    addToWaitingStack,
    createGroup,
  };
  return (
    <conversationContext.Provider value={contextData}>
      {children}
    </conversationContext.Provider>
  );
}
export { conversationContext };
export default ContextProvider;
