import { fork } from "redux-saga/effects";

import homeSaga from "./Home/home-sagas";
import projectsSaga from "./Projects/projects-sagas";
import projectSaga from "./Project/project-sagas";
import registerSagas from "./Registration/registration-sagas";
import watchSaga from "./Watch/watch-sagas";
import readSaga from "./Read/read-sagas";
import profileSaga from "./Profile/profile-sagas";
import userSaga from "./User/user-sagas";
import connectSaga from "./Connect/connect-sagas";

const sagas = [
  homeSaga,
  projectsSaga,
  projectSaga,
  registerSagas,
  watchSaga,
  readSaga,
  profileSaga,
  userSaga,
  connectSaga
];

export default function* rootSaga() {
  yield sagas.map(saga => fork(saga));
}
