import { createContext, useReducer, useEffect, useContext } from "react";
import { apiUrl } from "./constant";
import conversationReducer from "../reducers/conversationReducer";
import { AuthContext } from "./authContext";
import { useCookies } from "react-cookie";
import axios from "axios";
const conversationContext = createContext();

function ContextProvider({ children }) {
  const { authState } = useContext(AuthContext);

  const [userData, dispatch] = useReducer(conversationReducer, {
    contactList: [],

    conversations: [],
    currConversationId: "",
    currConversation: [],

    chatInfo: {},
    onlineList: {},
  });
  const [cookies] = useCookies(["token"]);

  /**
   *
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
      })
      .catch((err) => {
        console.error(err);
      });
    return result;
  };

  /**
   *
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

  const selectConversation = async ({ id, name, url, receiverId, type }) => {
    if (userData.currConversationId !== id) {
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
              },
            },
          });
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

  const contextData = {
    addContact,
    getAllContact,
    userData,
    selectConversation,
    updateFriendStatus,
  };
  return (
    <conversationContext.Provider value={contextData}>
      {children}
    </conversationContext.Provider>
  );
}
export { conversationContext };
export default ContextProvider;
