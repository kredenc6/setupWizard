import { MessageProps, MessageType, SwState } from "../interfaces/variousInterfaces";

export function createMessage(type: MessageType, text: string): MessageProps {
  if(type === "warning") {
    console.warn(text);
  } else
  if(type === "error") {
    console.error(text);
  } else {
    console.log(text);
  }
  return { text, type };
}

/**Finds the last pending message with the same newMessage type. If it's text is different than the text of newMessage
 * new pendingMessages with the newMessage are returned, else unchanged pendingMessages are returned.*/
export function messageAdder(newMessage: MessageProps, pendingMessages: MessageProps[]) {
  const lastMessageWithSameTopic = [...pendingMessages].reverse()
    .find(pendingMessage => pendingMessage.type === newMessage.type);

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