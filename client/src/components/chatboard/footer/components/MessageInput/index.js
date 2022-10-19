import { useContext } from "react";
import InputText from "../../../../typemessage";
import { chatboardContext } from "../../../context";

function MessageInput() {
  const { messageData, typeMessage } = useContext(chatboardContext);
  return <InputText text={messageData.message} setText={typeMessage} />;
}

export default MessageInput;
