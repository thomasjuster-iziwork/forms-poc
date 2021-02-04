import React, { FunctionComponent } from "react"
import { FloatInput, Field, FieldProps } from "../inputs"
import { BusinessRule } from "../forms/interfaces"
import { MissionForm, MissionFormValues } from "./form"
import { composeBusinessRules, composeErrors } from "../forms/helpers"

const DurationInput: FunctionComponent = () => {
  const { domNodeRef, state } = MissionForm.useFormField(
    "duration",
    Duration.getError
  )
  return (
    <FloatInput
      id="mission.duration"
      ref={domNodeRef}
      name="duration"
      value={state.values.duration}
      onChange={(number) => state.setValues({ duration: number })}
    />
  )
}

const DurationField: FunctionComponent<Partial<FieldProps>> = (props) => {
  return <Field label={"Mission duration"} control={<DurationInput />} {...props} />
}

export const startEndDateChangeRule: BusinessRule<MissionFormValues> = (
  prev,
  current
) => {
  const { startDate, endDate } = current
  const startDateChanged = prev.startDate !== startDate
  const endDateChanged = prev.endDate !== endDate
  const shouldUpdate =
    (startDateChanged || endDateChanged) && startDate && endDate
  if (!shouldUpdate) return current

  const duration = endDate!.getDate() - startDate!.getDate()
  return {
    ...current,
    duration,
  }
}

export const Duration = {
  Input: DurationInput,
  Field: DurationField,
  getError: composeErrors(() => null),
  businessRules: composeBusinessRules(startEndDateChangeRule),
}
