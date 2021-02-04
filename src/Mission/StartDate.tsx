import React, { FunctionComponent, useRef } from "react"
import { DateInput, Field, FieldProps } from "../inputs"
import { composeBusinessRules, composeErrors } from "../forms/helpers"
import { MissionForm, MissionFormValues } from "./form"
import { getRequiredError } from "../forms/validators/common"
import { startAndEndDateMustMatch } from "../forms/validators/date"

type Props = Partial<FieldProps>

const Input: FunctionComponent<Props> = ({ label, ...props }) => {
  const { domNodeRef, state } = MissionForm.useFormField(
    "startDate",
    StartDate.getError
  )
  return (
    <Field
      ref={domNodeRef}
      label={label || "Start date"}
      control={
        <DateInput
          value={state.values.startDate}
          onChange={(startDate) => state.setValues({ startDate })}
          required
          {...props}
        />
      }
      error={StartDate.getError(state.values)}
    />
  )
}

const isRequired = ({ endDate }: MissionFormValues) => endDate instanceof Date

const getError = composeErrors<MissionFormValues>(
  (values) => (isRequired(values) ? getRequiredError(values.startDate) : null),
  ({ startDate, endDate }) =>
    startDate && endDate ? startAndEndDateMustMatch(startDate, endDate) : null
)

export const StartDate = {
  Input,
  getError,
  businessRules: composeBusinessRules(),
}
