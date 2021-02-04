import React, { useRef } from "react";
import Field from "../Field";
import { useField } from "./Form";
import DateInput from "../inputs/DateInput";
import { startAndEndDateMustMatch } from "../forms/isDateRangeValid";
import { isRequired } from "../forms/isRequired";
import { getErrors } from "../forms/getErrors";

const getError = getErrors(
  ({ startDate }) => isRequired(startDate),
  ({ startDate, endDate }) => startAndEndDateMustMatch(startDate, endDate)
);

const Input = ({ label, ...props }) => {
  const fieldRef = useRef();
  const { values, actions } = useField({
    domNode: fieldRef,
    getError,
    applyRules: null
  });
  return (
    <Field
      ref={fieldRef}
      label={label || "Start date"}
      control={
        <DateInput
          value={values.startDate}
          onChange={(startDate) => actions.changeValue("startDate", startDate)}
          required
          {...props}
        />
      }
      error={getError(values)}
    />
  );
};

const display = (startDate) => startDate?.toISOString();

export const StartDate = {
  Input,
  display,
  getError
};
