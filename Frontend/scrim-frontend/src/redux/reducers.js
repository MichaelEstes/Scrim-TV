import { combineReducers } from "redux";

import { homeReducers } from "./Home/home-reducers";
import { projectsReducers } from "./Projects/projects-reducers";
import { projectReducers } from "./Project/project-reducers";
import { registrationReducers } from "./Registration/registration-reducers";
import { watchReducers } from "./Watch/watch-reducers";
import { readReducers } from "./Read/read-reducers";
import { profileReducers } from "./Profile/profile-reducers";
import { userReducers } from "./User/user-reducers";
import { connectReducers } from "./Connect/connect-reducers";

const reducers = combineReducers({
  homeParams: homeReducers,
  projectsParams: projectsReducers,
  projectParams: projectReducers,
  registrationParams: registrationReducers,
  videoParams: watchReducers,
  paperParams: readReducers,
  profileParams: profileReducers,
  userParams: userReducers,
  connectParams: connectReducers
});

export default reducers;
