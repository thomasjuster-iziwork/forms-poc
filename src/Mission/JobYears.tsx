import React, { FunctionComponent } from "react"
import { composeBusinessRules, composeErrors } from "../forms/helpers"
import { FloatInput, FloatInputProps, Field, FieldProps } from "../inputs"
import { MissionForm } from "./form"

type Props = Partial<FieldProps> & { index: number } & Omit<FloatInputProps, 'value' | 'onChange'>

const Input: FunctionComponent<Props> = ({
  index,
  label,
  error,
  control,
  ...props
}) => {
  const state = MissionForm.useFormState()

  return (
    <Field
      label={label || "Years"}
      error={error || JobYears.getError(state.values)}
      control={
        control || (
          <FloatInput
            value={state.values.jobs[index].years}
            onChange={(years) => {
              state.setListValue("jobs", index, {
                ...state.values.jobs[index],
                years,
              })
            }}
            {...props}
          />
        )
      }
    />
  )
}

export const JobYears = {
  Input,
  businessRules: composeBusinessRules(),
  getError: composeErrors(),
}
