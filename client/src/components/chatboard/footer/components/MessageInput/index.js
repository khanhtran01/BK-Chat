import { useContext } from "react";
import InputText from "../../../../typemessage";
import { chatboardContext } from "../../../context";

function MessageInput() {
  const { userData, typeMessage } = useContext(chatboardContext);
  return <InputText text={userData.message} setText={typeMessage} />;
}

export default MessageInput;
