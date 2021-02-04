import { compose } from "../forms/state";
import { Duration } from "./Duration";
import { EndDate } from "./EndDate";
import { Ssn } from "./Ssn";

export const initialState = {
  startDate: new Date(),
  endDate: new Date(),
  duration: 10,
  ssn: "192099201926032",
  jobs: [{ name: "Explorer", years: 1 }]
  // missionName: "",
  // jobs: [{ name: "" }]
};

export const applyMissionBusinessRules = compose(
  Duration.applyRules,
  EndDate.applyRules,
  Ssn.applyRules
  // reduceMissionVisibility,
  // reduceJobsVisibility,
  // reduceStartDateValue
);
