import React, { ComponentPropsWithoutRef, forwardRef } from "react"
import { InputValueParams, makeUseInputValue } from "./useInputValue"

const floatIsEqual = (a: number | null, b: number | null) => a === b

const customFormatFloat = (n: number | null): string =>
  n ? `${n.toLocaleString("fr-FR")}` : ""

const customParseFloat = (n: string): number | null => {
  const asString = (n || "").replace(/\s/g, "").replace(",", ".")
  const number = Number(asString)
  return Number.isNaN(number) || n === "" ? null : number
}
const useFloatValue = makeUseInputValue({
  format: customFormatFloat,
  parse: customParseFloat,
  isEqual: floatIsEqual,
})

type Props = Omit<
  ComponentPropsWithoutRef<"input">,
  keyof InputValueParams<any>
> &
  InputValueParams<number>
export type FloatInputProps = Props;

export const FloatInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, ...props }, ref) => {
    const { inputValue, setInputValue, onFocus, onBlur } = useFloatValue({
      value,
      onChange,
    })

    return (
      <input
        type="text"
        onFocus={(event) => {
          onFocus()
          props.onFocus?.(event)
        }}
        onBlur={(event) => {
          onBlur()
          props.onBlur?.(event)
        }}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        {...props}
        ref={ref}
      />
    )
  }
)
