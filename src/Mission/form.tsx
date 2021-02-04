import { composeBusinessRules } from '../forms/helpers'
import { makeForm } from "../forms/react-context";
import { Duration } from './Duration'
import { EndDate } from './EndDate'
import { Ssn } from './Ssn'

export type MissionFormValues = {
  startDate: Date | null;
  endDate: Date | null;
  duration: number | null;
  ssn: string | null;
  jobs: Array<{
    name: string | null;
    years: number | null;
  }>;
};

const defaultValues: MissionFormValues = {
  startDate: null,
  endDate: null,
  duration: null,
  ssn: null,
  jobs: [],
};

const businessRules = composeBusinessRules(
  Duration.businessRules,
  EndDate.businessRules,
  Ssn.businessRules,
);

const Form = makeForm<MissionFormValues>(businessRules);

const getInitialValues = async (_someParametersForFetchingHere: any) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const today = new Date();
  const afterTomorrow = new Date();
  afterTomorrow.setDate(afterTomorrow.getDate() + 2);
  return {
    startDate: today,
    endDate: afterTomorrow,
    duration: 12,
    ssn: "299239923923921",
    jobs: [
      { name: "Explorer", years: 10 },
      { name: "Investor", years: 5 },
      { name: "Agricultor", years: 8 }
    ]
  };
};

// everything is testable here.
export const MissionForm = {
  ...Form,
  businessRules,
  getInitialValues,
  defaultValues,
} as const;
