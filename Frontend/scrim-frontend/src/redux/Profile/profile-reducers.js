import { FETCH_PROFILE_DATA, FETCH_PROFILE_SUCCESS, FETCH_PROFILE_FAIL } from "../types";

const defaultState = {
  fetching: true
};

export const profileReducers = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_DATA:
      return {
        ...state,
        fetching: true,
        id: action.id
      };
    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        fetching: false,
        data: action.data
      };
    case FETCH_PROFILE_FAIL:
      return {
        ...state,
        fetching: false,
        error: action.error
      };
    default:
      return {
        ...state
      };
  }
};
