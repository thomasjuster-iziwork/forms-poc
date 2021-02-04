import { useState, useEffect, useCallback, useRef } from "react"

type MakeParams<T> = {
  isEqual: (a: T | null, b: T | null) => boolean
  format: (value: T | null) => string
  parse: (value: string) => T | null
}

export type InputValueParams<T> = {
  value: T | null
  onChange: (value: T | null) => void
}
export const makeUseInputValue = <T>({
  isEqual,
  format,
  parse,
}: MakeParams<T>) => ({ value, onChange }: InputValueParams<T>) => {
  return useInputValue({ isEqual, format, parse, value, onChange })
}

export const noop = <T>(value: T): T => value;
export type UseInputValueParams<T> = MakeParams<T> & InputValueParams<T>;

export const useInputValue = <T>({
  value,
  onChange,
  isEqual,
  format,
  parse,
}: MakeParams<T> & InputValueParams<T>) => {
  const [inputValue, setInputValue] = useState(format(value) || "")
  const isFocused = useRef(false)
  const onFocus = useCallback(() => {
    isFocused.current = true
  }, [])
  const onBlur = useCallback(() => {
    const nextInputValue = format(value)
    setInputValue(nextInputValue)
    isFocused.current = false
  }, [format, value])

  useEffect(() => {
    const nextValue = parse(inputValue)
    if (!isFocused.current || isEqual(nextValue, value)) {
      return
    }
    onChange(nextValue)
  }, [inputValue])

  useEffect(() => {
    const currentValue = parse(inputValue)
    if (isFocused.current || isEqual(currentValue, value)) {
      return
    }
    setInputValue(format(value))
  }, [value])

  return { inputValue, setInputValue, onFocus, onBlur } as const
}
