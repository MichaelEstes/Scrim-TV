import { FETCH_PAPER_DATA, FETCH_PAPER_SUCCESS, FETCH_PAPER_FAIL } from "../types";

const defaultState = {
  fetching: false
};

export const readReducers = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_PAPER_DATA:
      return {
        ...state,
        fetching: true
      };
    case FETCH_PAPER_SUCCESS:
      return {
        ...state,
        fetching: false,
        ...action.data
      };
    case FETCH_PAPER_FAIL:
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
