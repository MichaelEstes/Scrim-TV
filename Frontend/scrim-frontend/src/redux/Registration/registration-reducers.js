import { REGISTER_USER, REGISTER_USER_SUCCESS, REGISTER_USER_FAIL } from "../types";

const defaultState = {
  registered: false
};

export const registrationReducers = (state = defaultState, action) => {
  switch (action.type) {
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        registered: true
      };
    case REGISTER_USER_FAIL:
      return {
        ...state,
        registered: false
      };
    default:
      return {
        ...state
      };
  }
};
