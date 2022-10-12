import { createContext, useReducer, useEffect } from "react";
import { apiUrl } from "./constant";
import conversationReducer from "../reducers/conversationReducer";
import axios from "axios";
const conversationContext = createContext();

function ContextProvider({ children }) {
  const [userData, dispatch] = useReducer(conversationReducer, {
    username: "",
    age: "",
    email: "",
    contactList: [],
    conversation: [],
  });

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

  useEffect(() => {
    console.log("init Contact");
    const initContactList = async () => {
      await getAllContact();
    };
    initContactList();
  }, []);

  const contextData = { addContact, getAllContact, userData };
  return (
    <conversationContext.Provider value={contextData}>
      {children}
    </conversationContext.Provider>
  );
}
export { conversationContext };
export default ContextProvider;
