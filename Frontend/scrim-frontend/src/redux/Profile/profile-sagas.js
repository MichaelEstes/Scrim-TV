import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_PROFILE_DATA, FETCH_PROFILE_SUCCESS, FETCH_PROFILE_FAIL } from "../types";
import { getProfile } from "../../global/api/endpoints";

function* parseData(input) {
  const { id } = input;
  let response = {};
  try {
    response = yield call(() => getProfile(id));
  } catch (error) {
    response.error = error;
  }

  if (response.error) {
    yield put({ type: FETCH_PROFILE_FAIL, error: response.error });
  } else {
    yield put({ type: FETCH_PROFILE_SUCCESS, data: response.data });
  }
}

export default function* profileSaga() {
  yield takeLatest(FETCH_PROFILE_DATA, parseData);
}
