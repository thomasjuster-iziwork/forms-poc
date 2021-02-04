export const isRequired = (value, message = "Required.") =>
  value ? undefined : message;
