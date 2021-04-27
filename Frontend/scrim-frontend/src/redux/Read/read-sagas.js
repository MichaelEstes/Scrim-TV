import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_PAPER_DATA, FETCH_PAPER_SUCCESS, FETCH_PAPER_FAIL } from "../types";
import { getPaper } from "../../global/api/endpoints";

function* parseData(params) {
  const response = yield getPaper(params.paperId);
  if (response.error) {
    yield put({ type: FETCH_PAPER_FAIL, error: response.error });
  } else {
    yield put({ type: FETCH_PAPER_SUCCESS, data: response.data });
  }
}

export default function* readSaga() {
  yield takeLatest(FETCH_PAPER_DATA, parseData);
}
