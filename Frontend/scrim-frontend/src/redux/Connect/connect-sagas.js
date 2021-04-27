import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_CONNECT_DATA, FETCH_CONNECT_SUCCESS, FETCH_CONNECT_FAIL } from "../types";
import { getRecommendedUsers } from "../../global/api/endpoints";

function* parseData(input) {
  const { userType } = input;
  const response = yield call(() => getRecommendedUsers(userType));
  if (response.error) {
    yield put({ type: FETCH_CONNECT_FAIL, error: response.error });
  } else {
    yield put({ type: FETCH_CONNECT_SUCCESS, data: response.data });
  }
}

export default function* connectSaga() {
  yield takeLatest(FETCH_CONNECT_DATA, parseData);
}
