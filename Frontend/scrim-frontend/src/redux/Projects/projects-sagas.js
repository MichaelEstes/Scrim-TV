import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_PROJECTS_DATA, FETCH_PROJECTS_SUCCESS, FETCH_PROJECTS_FAIL } from "../types";
import { getProjects } from "../../global/api/endpoints";

function* parseData() {
  const response = yield call(getProjects);
  if (response.error) {
    yield put({ type: FETCH_PROJECTS_FAIL, error: response.error });
  } else {
    yield put({ type: FETCH_PROJECTS_SUCCESS, data: response.data });
  }
}

export default function* projectsSaga() {
  yield takeLatest(FETCH_PROJECTS_DATA, parseData);
}
