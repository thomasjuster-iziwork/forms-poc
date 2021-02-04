import React, { useRef } from "react";
import Field from "../Field";
import { useField } from "./Form";
import { compose, hasChanged } from "../forms/state";
import DateInput from "../inputs/DateInput";
import { startAndEndDateMustMatch } from "../forms/isDateRangeValid";
import { getErrors } from "../forms/getErrors";

const getError = getErrors(({ startDate, endDate }) =>
  startAndEndDateMustMatch(startDate, endDate)
);

const Input = ({ label, ...props }) => {
  const fieldRef = useRef();
  const { values, actions } = useField({
    domNode: fieldRef,
    getError: EndDate.getError,
    applyRules: EndDate.applyRules
  });
  return (
    <Field
      ref={fieldRef}
      label={label || "End date"}
      control={
        <DateInput
          value={values.endDate}
          onChange={(nextValue) => actions.changeValue("endDate", nextValue)}
          {...props}
        />
      }
      error={getError(values)}
    />
  );
};

const presetEndDateWithStartDate = (state, action) => {
  console.info("state.startDate", state.startDate);
  const startDateChanged = hasChanged("startDate")(action);
  const endDateIsDefined = !!state.endDate;
  const isNoop = !startDateChanged || !state.startDate || endDateIsDefined;
  if (isNoop) return state;

  console.info("state.startDate", state.startDate);
  const endDate = new Date(state.startDate);
  endDate.setDate(endDate.getDate() + 1);
  return {
    ...state,
    endDate
  };
};

const setEndDateWithStartDateAndDuration = (state, action) => {
  const durationChanged = hasChanged("duration")(action);
  const startDateChanged = hasChanged("startDate")(action);
  const { duration, startDate } = state;
  const isNoop =
    (!durationChanged && !startDateChanged) || (!duration && !startDate);
  if (isNoop) return state;

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + duration);
  return {
    ...state,
    endDate
  };
};

export const EndDate = {
  Input,
  display: (endDate) => endDate?.toISOString(),
  getError,
  applyRules: compose(
    presetEndDateWithStartDate,
    setEndDateWithStartDateAndDuration
  ),
  canEdit: ({ startDate }) => !!startDate
};
