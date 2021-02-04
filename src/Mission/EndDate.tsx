import React, { FunctionComponent } from "react"
import { MissionForm, MissionFormValues } from "./form"
import { DateInput, Field } from "../inputs"
import { startAndEndDateMustMatch } from "../forms/isDateRangeValid"
import { composeBusinessRules, composeErrors } from "../forms/helpers"
import { FieldProps } from "../inputs"
import { BusinessRule } from "../forms/interfaces"

const getError = composeErrors<MissionFormValues>(
  ({ startDate, endDate }) =>
    startDate && endDate ? startAndEndDateMustMatch(startDate, endDate) : null,
  () => null,
  () => null
)

const Input: FunctionComponent<Partial<FieldProps>> = ({ label, ...props }) => {
  const { domNodeRef, state } = MissionForm.useFormField(
    "endDate",
    EndDate.getError
  )
  return (
    <Field
      ref={domNodeRef}
      label={label || "End date"}
      control={
        <DateInput
          value={state.values.endDate}
          onChange={(nextValue) => state.setValues({ endDate: nextValue })}
          {...props}
        />
      }
      error={getError(state.values)}
    />
  )
}

const addDays = (days: number) => (date: Date) => {
  const nextDate = new Date(date)
  nextDate.setDate(date.getDate() + days)
  return nextDate
}
const presetWithStartDateAndDuration: BusinessRule<MissionFormValues> = (
  prev,
  current
) => {
  const { startDate, duration } = current
  const startDateChanged = prev.startDate !== startDate
  const durationChanged = prev.duration !== duration
  const shouldUpdate =
    (startDateChanged || durationChanged) &&
    startDate &&
    duration &&
    !current.endDate
  if (!shouldUpdate) return current

  return {
    ...current,
    endDate: addDays(duration!)(startDate!),
  }
}

export const EndDate = {
  Input,
  getError,
  businessRules: composeBusinessRules(presetWithStartDateAndDuration),
  isEditable: ({ startDate, duration }: MissionFormValues) => !startDate || !duration,
}
