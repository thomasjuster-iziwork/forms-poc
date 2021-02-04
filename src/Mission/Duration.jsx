import React, { useRef } from "react";
import Field from "../Field";
import { compose, hasChanged } from "../forms/state";
import FloatInput from "../inputs/FloatInput";
import { useField } from "./Form";

const Input = () => {
  const fieldRef = useRef();
  const { values, actions } = useField({
    domNode: fieldRef,
    getError: Duration.getError,
    applyRules: Duration.applyRules
  });
  return (
    <Field
      label={"Mission duration"}
      control={
        <FloatInput
          id="mission.duration"
          name="duration"
          value={values.duration}
          onChange={(number) => actions.changeValue("duration", number)}
        />
      }
    />
  );
};

export const handleStartEndDateChange = (values, action) => {
  const startDateChanged = hasChanged("startDate")(action);
  const endDateChanged = hasChanged("endDate")(action);
  const { startDate, endDate } = values;
  const isNoop =
    (!startDateChanged && !endDateChanged) || !startDate || !endDate;
  if (isNoop) return values;

  const duration = endDate.getDate() - startDate.getDate();
  return {
    ...values,
    duration
  };
};

export const Duration = {
  Input,
  getError: () => null,
  applyRules: compose(handleStartEndDateChange)
};
