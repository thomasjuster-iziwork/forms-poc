import { useState, useEffect, useCallback, useRef } from "react";

export function makeUseInputValue({ isEqual, format, parse }) {
  return ({ value, onChange }) =>
    useInputValue({ isEqual, format, parse, value, onChange });
}

export function useInputValue({ value, onChange, isEqual, format, parse }) {
  const [inputValue, setInputValue] = useState(format(value) || "");
  const isFocused = useRef(false);
  const onFocus = useCallback(() => {
    isFocused.current = true;
  }, []);
  const onBlur = useCallback(() => {
    const nextInputValue = format(value) ?? "";
    setInputValue(nextInputValue);
    isFocused.current = false;
  }, [format, value]);

  useEffect(() => {
    const nextValue = parse(inputValue);
    if (!isFocused.current || isEqual(nextValue, value)) {
      return;
    }
    onChange(nextValue);
  }, [inputValue]);

  useEffect(() => {
    const currentValue = parse(inputValue);
    if (isFocused.current || isEqual(currentValue, value)) {
      return;
    }
    setInputValue(format(value) ?? "");
  }, [value]);

  return [inputValue, setInputValue, onFocus, onBlur];
}
