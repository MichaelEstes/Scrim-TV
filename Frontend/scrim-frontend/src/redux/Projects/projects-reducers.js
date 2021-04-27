import { FETCH_PROJECTS_DATA, FETCH_PROJECTS_SUCCESS, FETCH_PROJECTS_FAIL } from "../types";

const defaultState = {
  fetching: true
};

export const projectsReducers = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_PROJECTS_DATA:
      return {
        ...state,
        fetching: true
      };
    case FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        fetching: false,
        data: action.data
      };
    case FETCH_PROJECTS_FAIL:
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
