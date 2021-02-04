import { FormFieldError } from "../interfaces"

export const getRequiredError = <T>(
  value: T | null,
  message = "Required."
): FormFieldError => (value ? null : message)
