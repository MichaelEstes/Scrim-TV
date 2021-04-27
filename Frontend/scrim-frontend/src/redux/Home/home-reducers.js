import { FETCH_HOME_DATA, FETCH_HOME_SUCCESS, FETCH_HOME_FAIL } from "../types";

const defaultState = {
  fetching: true
};

export const homeReducers = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_HOME_DATA:
      return {
        ...state,
        fetching: true
      };
    case FETCH_HOME_SUCCESS:
      return {
        ...state,
        fetching: false,
        data: action.data
      };
    case FETCH_HOME_FAIL:
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
