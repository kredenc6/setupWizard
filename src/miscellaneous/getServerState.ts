import { ServerIs } from "../interfaces/interfaces";

export default function getServerState(serverAddress: string): Promise<ServerIs> {
  return fetch(serverAddress)
    .then(response => response.status === 200 ? "online" : "offline")
    .catch(err => {
      console.log(err.message);
      return "offline";
    });
}