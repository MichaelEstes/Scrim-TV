import { call, put, takeLatest, select } from "redux-saga/effects";

import { REGISTER_USER, REGISTER_USER_SUCCESS, REGISTER_USER_FAIL } from "../types";

import { postUser } from "../../global/api/endpoints";

function* registerUser({ payload }) {
  try {
    const { displayName, email, firstName, lastName, password } = payload;
    const requestParams = {
      displayName,
      email,
      firstName,
      lastName,
      password
    };
    const isRegistered = yield call(postUser, requestParams);
    yield put({ type: REGISTER_USER_SUCCESS, payload: isRegistered });
  } catch (e) {
    yield put({ type: REGISTER_USER_FAIL, error: e.message });
  }
}

export default function* registerSaga() {
  yield takeLatest(REGISTER_USER, registerUser);
}
