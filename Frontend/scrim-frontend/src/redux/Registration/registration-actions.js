import { REGISTER_USER } from "../types";

export function registerUser(info) {
  return {
    type: REGISTER_USER,
    payload: info
  };
}
