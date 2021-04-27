import { FETCH_VIDEO_DATA } from "../types";

export function fetchVideoData(broadcastId) {
  return {
    type: FETCH_VIDEO_DATA,
    broadcastId: broadcastId
  };
}
