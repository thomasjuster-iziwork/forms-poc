import React, { ComponentPropsWithoutRef, forwardRef } from "react"
import { InputValueParams, makeUseInputValue } from "./useInputValue"

const isEqual = (a: Date | null, b: Date | null) =>
  a?.toISOString().slice(0, 10) === b?.toISOString().slice(0, 10)

const format = (date: Date | null): string => {
  return date?.toISOString()?.slice(0, 10) ?? ""
}
const parse = (str: string): Date | null => {
  switch (str?.toLowerCase()) {
    case "today":
      const today = new Date()
      return today
    case "tomorrow":
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow
    default:
      const date = new Date(str)
      return date.toString() === "Invalid Date" ? null : date
  }
}

const useInputValue = makeUseInputValue({
  format,
  isEqual,
  parse,
})

type Props = Omit<
  ComponentPropsWithoutRef<"input">,
  keyof InputValueParams<any>
> &
  InputValueParams<Date>

export const DateInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, ...props }, ref) => {
    const { inputValue, setInputValue, onFocus, onBlur } = useInputValue({
      value,
      onChange,
    })

    return (
      <input
        {...props}
        ref={ref}
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onFocus={(event) => {
          onFocus()
          props.onFocus?.(event)
        }}
        onBlur={(event) => {
          onBlur()
          props.onBlur?.(event)
        }}
      />
    )
  }
)
