import { MessageProps, SwState } from "../interfaces/variousInterfaces";

// TODO createMessage can be simplified?
export function createMessage(topic: string, value: any): MessageProps | null {
  switch(topic) {
    case "server": {
      const type = value === "offline" ? "warning" : "info";
      return { topic, text: `Server is ${value}.`, type };
    }

    case "fileStatus": {
      return { topic, text: `Json is ${value}.`, type: "info" };
    }

    case "repoUpdate": {
      return { topic, text: "Repo state updated.", type: "info" };
    }

    case "success": {
      console.log(value);
      return { topic, text: value, type: "success" };
    }

    case "info": {
      console.log(value);
      return { topic, text: value, type: "info" };
    }

    case "warning": {
      console.warn(value);
      return { topic, text: value , type: "warning" };
    }

    case "error": {
      console.error(value);
      return { topic, text: value, type: "error" };
    }

    default: {
      console.warn("Creating message object failed.");
      return null;
    }
  }
}

/**Finds the last pending message with the same newMessage topic. If it's text is different than the text of newMessage
 * new pendingMessages with the newMessage are returned, else unchanged pendingMessages are returned.*/
export function messageAdder(newMessage: MessageProps, pendingMessages: MessageProps[]) {
  const lastMessageWithSameTopic = [...pendingMessages].reverse()
    .find(pendingMessage => pendingMessage.topic === newMessage.topic);

  if(lastMessageWithSameTopic?.text === newMessage.text) return pendingMessages;
  return [...pendingMessages, newMessage];
}

export function placeNewMessage(newMessage: MessageProps | null, state: SwState) {
  if(!newMessage) return {};
  if(!state.activeMessage) {
    return { activeMessage: newMessage };
  }
  const pendingMessages = messageAdder(newMessage, state.pendingMessages);
  return { pendingMessages };
}