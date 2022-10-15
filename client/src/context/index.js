import { createContext, useReducer, useEffect } from "react";
import { apiUrl } from "./constant";
import conversationReducer from "../reducers/conversationReducer";
import { useCookies } from "react-cookie";
import axios from "axios";
const conversationContext = createContext();

function ContextProvider({ children }) {
  const [userData, dispatch] = useReducer(conversationReducer, {
    contactList: [],
    conversation: [],
    chatInfo: {},
    currConversationId: "",
    currConversation: [],
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

  /**
   * Init all contact to load to UI
   */
  useEffect(() => {
    const initContactList = async () => {
      await getAllContact();
    };
    if (cookies.token) {
      initContactList();
    }
  }, []);

  const selectConversation = async ({ id, name, url }) => {
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
              },
            },
          });
        });
    }
  };

  const contextData = {
    addContact,
    getAllContact,
    userData,
    selectConversation,
  };
  return (
    <conversationContext.Provider value={contextData}>
      {children}
    </conversationContext.Provider>
  );
}
export { conversationContext };
export default ContextProvider;
