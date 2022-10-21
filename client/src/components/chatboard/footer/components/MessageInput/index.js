import { useContext } from "react";
import InputText from "../../../../typemessage";
import { chatboardContext } from "../../../context";

function MessageInput() {
  const { messageData, typeMessage } = useContext(chatboardContext);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log('do validate')
    }
  }
  return (
    <InputText
      text={messageData.message}
      setText={typeMessage}
    />
  );
}

export default MessageInput;
