import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_USER_DATA, FETCH_USER_SUCCESS, FETCH_USER_FAIL } from "../types";
import { getUser } from "../../global/api/endpoints";

function* parseData(input) {
  const { id } = input;
  let response = {};
  try {
    response = yield call(() => getUser(id));
  } catch (error) {
    response.error = error;
  }

  if (response.error) {
    yield put({ type: FETCH_USER_FAIL, error: response.error });
  } else {
    yield put({ type: FETCH_USER_SUCCESS, data: response.data });
  }
}

export default function* userSaga() {
  yield takeLatest(FETCH_USER_DATA, parseData);
}
