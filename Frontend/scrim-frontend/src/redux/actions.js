import * as homeActions from "./Home/home-actions";
import * as projectsActions from "./Projects/projects-actions";
import * as projectActions from "./Project/project-actions";
import * as registrationActions from "./Registration/registration-actions";
import * as watchActions from "./Watch/watch-actions";
import * as readActions from "./Read/read-actions";
import * as profileActions from "./Profile/profile-actions";
import * as userActions from "./User/user-actions";
import * as connectActions from "./Connect/connect-actions";

export default {
  ...homeActions,
  ...projectsActions,
  ...projectActions,
  ...registrationActions,
  ...watchActions,
  ...readActions,
  ...profileActions,
  ...userActions,
  ...connectActions
};
