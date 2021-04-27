import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_HOME_DATA, FETCH_HOME_SUCCESS, FETCH_HOME_FAIL } from "../types";
import { getHome } from "../../global/api/endpoints";

function* parseData() {
  const response = yield call(getHome);
  if (response.error) {
    yield put({ type: FETCH_HOME_FAIL, error: response.error });
  } else {
    yield put({ type: FETCH_HOME_SUCCESS, data: response.data });
  }
}

export default function* homeSaga() {
  yield takeLatest(FETCH_HOME_DATA, parseData);
}
