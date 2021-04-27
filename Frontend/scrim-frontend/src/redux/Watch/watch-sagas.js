import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_VIDEO_DATA, FETCH_VIDEO_SUCCESS, FETCH_VIDEO_FAIL } from "../types";
import { getVideo } from "../../global/api/endpoints";

function* parseData(params) {
  const response = yield getVideo(params.broadcastId);
  if (response.error) {
    yield put({ type: FETCH_VIDEO_FAIL, error: response.error });
  } else {
    yield put({ type: FETCH_VIDEO_SUCCESS, data: response.data });
  }
}

export default function* watchSaga() {
  yield takeLatest(FETCH_VIDEO_DATA, parseData);
}
