import { FETCH_PROJECT_DATA } from "../types";

export function fetchProjectData(projectId) {
  return {
    type: FETCH_PROJECT_DATA,
    projectId: projectId
  };
}
