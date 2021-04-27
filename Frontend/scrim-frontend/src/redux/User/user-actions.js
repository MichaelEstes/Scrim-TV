import { FETCH_USER_DATA } from "../types";

export function fetchUserData(id) {
  return {
    type: FETCH_USER_DATA,
    id: id
  };
}
