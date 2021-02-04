import React, { ComponentPropsWithoutRef, forwardRef, useCallback } from "react"
import { useInputValue, UseInputValueParams } from "./useInputValue"

const textIsEqual = (a: string | null, b: string | null) => a === b
const noop = (text: string | null) => text

type TextValue = string | null
type Props = Omit<
  ComponentPropsWithoutRef<"input">,
  keyof UseInputValueParams<any>
> &
  Omit<UseInputValueParams<TextValue>, "isEqual">

export const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ value, parse = noop, format = noop, onChange, ...props }, ref) => {
    const { inputValue, setInputValue, onFocus, onBlur } = useInputValue({
      value,
      onChange,
      format: useCallback((text: TextValue) => format(text) || "", [format]),
      parse: useCallback((text: string) => parse(text) || null, [parse]),
      isEqual: textIsEqual,
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
