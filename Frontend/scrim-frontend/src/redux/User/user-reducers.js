import { FETCH_USER_DATA, FETCH_USER_SUCCESS, FETCH_USER_FAIL } from "../types";

const defaultState = {
  fetching: true
};

export const userReducers = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_USER_DATA:
      return {
        ...state,
        fetching: true,
        id: action.id
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        fetching: false,
        data: action.data
      };
    case FETCH_USER_FAIL:
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
