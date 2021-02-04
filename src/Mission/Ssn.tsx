import React, { FunctionComponent } from "react";
import { composeBusinessRules, composeErrors } from '../forms/helpers'
import { BusinessRule } from '../forms/interfaces'
import { TextInput, Field, FieldProps } from "../inputs";
import { MissionForm, MissionFormValues } from './form'

const formatSSN = (value: string | null): string =>
  [
    value?.slice(0, 1), //   1 → gender
    value?.slice(1, 3), //  89 → yearOfBirth
    value?.slice(3, 5), //  06 → monthOfBirth
    value?.slice(5, 7), //  75 → departmentOfBirth
    value?.slice(7, 10), // 079 → regionOfBirth (in France, INSEE postal code)
    value?.slice(10, 13), // 240 → nthBirthInMonth
    value?.slice(13, 15) //  38 → ssnKey
  ]
    .filter(Boolean)
    .join(" ");

const parseSSN = (value: string): string | null => (value || "").replace(/\s/g, "") || null;

type Props = Partial<FieldProps>;

const Input: FunctionComponent<Props> = ({ label, ...props }) => {
  const { domNodeRef, state } = MissionForm.useFormField('ssn', Ssn.getError);
  return (
    <Field
      ref={domNodeRef}
      label={label || "SSN"}
      control={
        <TextInput
          value={state.values.ssn}
          onChange={(ssn) => state.setValues({ ssn })}
          parse={parseSSN}
          format={formatSSN}
        />
      }
      error={Ssn.getError(state.values)}
    />
  );
};

const incrementSsnWithDuration: BusinessRule<MissionFormValues> = (prev, current) => {
  const durationChanged = prev.duration !== current.duration;
  const shouldUpdate = durationChanged && current.duration && current.ssn;
  if (!shouldUpdate) return current;

  const asNumber = Number(current.ssn!.replace(/\s/g, ""));
  const nextSsn = String(asNumber + current.duration!);
  return { ...current, ssn: nextSsn };
};

export const Ssn = {
  Input,
  getError: composeErrors<MissionFormValues>(() => null),
  businessRules: composeBusinessRules(incrementSsnWithDuration)
};
