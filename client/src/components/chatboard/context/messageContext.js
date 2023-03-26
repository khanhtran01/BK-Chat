import { createContext, useReducer, useContext, useCallback } from "react";

import messageReducer from "../reducer/messageReducer";
import { conversationContext } from "../../../context";
import { replyContext } from "./replyContext";
import debounce from "lodash/debounce";
const messageContext = createContext();

const MessageContextProvider = ({ children }) => {

    const { userData } = useContext(conversationContext);

    const [message, dispatch] = useReducer(messageReducer, {
        message: "",
        replyFor: "",
        tagList: [],
    })

    const checkTags = useCallback((message) => {
        if (userData.chatInfo.type === "single") {
            return;
        }
        const tagList = message.split("@");

        if (tagList.length > 1) {
            let memlist = [];
            for (let i = 0; i < userData.chatInfo.member.length; i++) {
                memlist = [
                    ...memlist,
                    {
                        name: userData.chatInfo.member[i].username,
                        avatar: userData.chatInfo.member[i].avatar,
                    },
                ];
            }

            const containList = [];
            // eslint-disable-next-line array-callback-return
            memlist.map((mem) => {
                if (mem.name.toLowerCase().includes(tagList.last().toLowerCase())) {
                    containList.push(mem);
                }
            });
            dispatch({ type: "SET_TAG_LIST", payload: containList });
        } else {
            dispatch({ type: "SET_TAG_LIST", payload: [] });
        }
    }, [JSON.stringify(userData.chatInfo)]);

    const debouncedFetchMembers = useCallback((message) => {
        const temp = debounce(() => checkTags(message), 500);
        temp();
    }, []);

    const handleTag = (username) => {
        const tagList = message.message.split("@");
        tagList[tagList.length - 1] = username;
        dispatch({ type: "HANDLE_TAG", payload: tagList.join("@") });
    };

    const typeMessage = (message) => {
        dispatch({ type: "TYPE_MESSAGE", payload: message });
        // checkTags(message);
        checkTags(message)
    };
    const reply = useCallback((chat) => {
        dispatch({ type: "SET_REPLY", payload: chat });
    }, []);

    const clearReply = () => {
        dispatch({ type: "CLEAR_REPLY" });
    };
    const clearTags = () => {
        dispatch({ type: "CLEAR_TAG" });
    }
    

    const value = {
        message, typeMessage,
        reply,
        clearReply,
        handleTag,
        dispatch,
        clearTags
    }
    return <messageContext.Provider
        value={value}>
        {children}
    </messageContext.Provider>

}

export default MessageContextProvider;
export { messageContext };