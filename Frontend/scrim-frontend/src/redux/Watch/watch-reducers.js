import { FETCH_VIDEO_DATA, FETCH_VIDEO_SUCCESS, FETCH_VIDEO_FAIL } from "../types";

const defaultState = {
  fetching: false
};

export const watchReducers = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_VIDEO_DATA:
      return {
        ...state,
        fetching: true
      };
    case FETCH_VIDEO_SUCCESS:
      return {
        ...state,
        fetching: false,
        ...action.data
      };
    case FETCH_VIDEO_FAIL:
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
