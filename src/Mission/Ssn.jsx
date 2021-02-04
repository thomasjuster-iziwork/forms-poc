import React, { useRef } from "react";
import Field from "../Field";
import { compose, hasChanged } from "../forms/state";
import TextInput from "../inputs/TextInput";
import { useField } from "./Form";

const formatSSN = (value = "") =>
  [
    value.slice(0, 1), //   1 → gender
    value.slice(1, 3), //  89 → yearOfBirth
    value.slice(3, 5), //  06 → monthOfBirth
    value.slice(5, 7), //  75 → departmentOfBirth
    value.slice(7, 10), // 079 → regionOfBirth (in France, INSEE postal code)
    value.slice(10, 13), // 240 → nthBirthInMonth
    value.slice(13, 15) //  38 → ssnKey
  ]
    .filter(Boolean)
    .join(" ");

const parseSSN = (value = "") => (value || "").replace(/\s/g, "");

const Input = ({ label, ...props }) => {
  const fieldRef = useRef();
  const { values, actions } = useField({
    domNode: fieldRef,
    getError: Ssn.getError,
    applyRules: Ssn.applyRules
  });
  return (
    <Field
      ref={fieldRef}
      label={label || "SSN"}
      control={
        <TextInput
          value={values.ssn || ""}
          onChange={(ssn) => actions.changeValue("ssn", ssn)}
          parse={parseSSN}
          format={formatSSN}
        />
      }
    />
  );
};

const incrementSsnWithDuration = (state, action) => {
  const durationChanged = hasChanged("duration")(action);
  const isNoop = !durationChanged || !state.duration || !state.ssn;
  // console.info({ durationChanged, duration: state.duration, ssn: state.ssn });
  if (isNoop) return state;

  const asNumber = Number(state.ssn.replace(/\s/g, ""));
  const nextSsn = String(asNumber + state.duration);
  return { ...state, ssn: nextSsn };
};

export const Ssn = {
  Input,
  getError: () => null,
  applyRules: compose(incrementSsnWithDuration)
};
