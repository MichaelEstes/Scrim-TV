import { FETCH_CONNECT_DATA, FETCH_CONNECT_SUCCESS, FETCH_CONNECT_FAIL } from "../types";

const defaultState = {
  fetching: true
};

export const connectReducers = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_CONNECT_DATA:
      return {
        ...state,
        fetching: true,
        userType: action.userType
      };
    case FETCH_CONNECT_SUCCESS:
      return {
        ...state,
        fetching: false,
        data: action.data
      };
    case FETCH_CONNECT_FAIL:
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
