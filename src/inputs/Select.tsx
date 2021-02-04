import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  useMemo,
} from "react"
import { noop, useInputValue, UseInputValueParams } from "./useInputValue"

type Option = string
type Value = any

type Props = Omit<
  ComponentPropsWithoutRef<"select">,
  keyof UseInputValueParams<any> | 'disabled'
> &
  UseInputValueParams<Value> & {
    options: Array<Option>
    formatLabel?: (option: Option, formattedOption: string) => ReactNode;
    disabled?: Option[]
    omitted?: Option[]
  }

export const Select = forwardRef<HTMLSelectElement, Props>(
  (
    {
      options,
      disabled = [] as Option[],
      omitted = [] as Option[],
      formatLabel = (_option, formattedOption) => formattedOption,
      format = noop,
      parse = noop,
      isEqual,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const { inputValue, setInputValue, onFocus, onBlur } = useInputValue({
      value,
      onChange,
      isEqual,
      format,
      parse,
    })

    const filteredOptions = useMemo(() => {
      return options.filter(
        (option) => value === option || !omitted.includes(option)
      )
    }, [options, omitted, value])

    return (
      <select
        {...props}
        ref={ref}
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
      >
        <option value="">{"Select. This or that, me don’t care."}</option>
        {filteredOptions.map((option) => (
          <option
            key={option}
            value={option}
            disabled={value !== option && disabled.includes(option)}
          >
            {formatLabel(option, format(option))}
          </option>
        ))}
      </select>
    )
  }
)
