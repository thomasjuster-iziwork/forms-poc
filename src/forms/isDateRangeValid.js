export const isDateRangeValid = (rangeInDays = 1) => (start, end) => {
  if (!start || !end) return true;
  const daysDiff = end.getDate() - start.getDate();
  return daysDiff >= rangeInDays;
};

export const getDateRangeError = ({
  rangeInDays = 1,
  message = "Date range invalid"
}) => (start, end) => {
  return isDateRangeValid(rangeInDays)(start, end) ? undefined : message;
};

export const startAndEndDateMustMatch = getDateRangeError({
  rangeInDays: 1,
  message: "Start date must be before end date"
});
