import { FETCH_CONNECT_DATA } from "../types";

export function fetchConnectData(userType) {
  return {
    type: FETCH_CONNECT_DATA,
    userType: userType
  };
}
