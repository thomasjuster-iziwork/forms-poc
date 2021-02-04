import { FormFieldError } from '../interfaces'

export const isDateRangeValid = (rangeInDays = 1) => (start: Date, end: Date): boolean => {
  if (!start || !end) return true;
  const daysDiff = end.getDate() - start.getDate();
  return daysDiff >= rangeInDays;
};

export const getDateRangeError = ({
  rangeInDays = 1,
  message = "Date range invalid"
}) => (start: Date, end: Date): FormFieldError => {
  return isDateRangeValid(rangeInDays)(start, end) ? null : message;
};

export const startAndEndDateMustMatch = getDateRangeError({
  rangeInDays: 1,
  message: "Start date must be before end date"
});
