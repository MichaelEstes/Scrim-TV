import { FETCH_PROJECT_DATA, FETCH_PROJECT_SUCCESS, FETCH_PROJECT_FAIL } from "../types";

const defaultState = {
  fetching: false
};

export const projectReducers = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_PROJECT_DATA:
      return {
        ...state,
        fetching: true
      };
    case FETCH_PROJECT_SUCCESS:
      return {
        ...state,
        fetching: false,
        data: action.data
      };
    case FETCH_PROJECT_FAIL:
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
