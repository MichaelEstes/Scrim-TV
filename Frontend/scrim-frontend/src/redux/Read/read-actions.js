import { FETCH_PAPER_DATA } from "../types";

export function fetchPaperData(paperId) {
  return {
    type: FETCH_PAPER_DATA,
    paperId: paperId
  };
}
