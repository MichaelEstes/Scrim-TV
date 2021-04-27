import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_PROJECT_DATA, FETCH_PROJECT_SUCCESS, FETCH_PROJECT_FAIL } from "../types";
import { getProject } from "../../global/api/endpoints";

function* parseData(params) {
  const response = yield getProject(params.projectId);
  if (response.error) {
    yield put({ type: FETCH_PROJECT_FAIL, error: response.error });
  } else {
    yield put({ type: FETCH_PROJECT_SUCCESS, data: response.data });
  }
}

export default function* readSaga() {
  yield takeLatest(FETCH_PROJECT_DATA, parseData);
}
