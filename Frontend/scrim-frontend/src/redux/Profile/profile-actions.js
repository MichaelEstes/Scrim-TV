import { FETCH_PROFILE_DATA } from "../types";

export function fetchProfileData(id) {
  return {
    type: FETCH_PROFILE_DATA,
    id: id
  };
}
