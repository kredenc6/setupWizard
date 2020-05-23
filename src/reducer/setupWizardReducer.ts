import { ReducerAction, ReducerState, Reducer } from "react";
import { sWState, ServerIs } from "../interfaces/interfaces";

type Action = {
  type: string;
  payload: Function
};

const sWReducer: Reducer<sWState, Action> = (state, action) => {
  switch(action.type) {
    case "toggleServerStatus":
      const newServerState: ServerIs = state.serverState === "offline" ? "online" : "offline";
      return { ...state, serverState: newServerState };

    default:
      throw new Error("Something went wrong in the reducer.");
  }
};

export default sWReducer;