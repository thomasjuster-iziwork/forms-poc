import React from "react";
import { useInputValue } from "./useInputValue";

const primitiveEquality = (a, b) => a === b;

const noop = (a) => a;
export default function TextInput({
  value,
  parse = noop,
  format = noop,
  onChange,
  ...props
}) {
  const [inputValue, setInputValue, onFocus, onBlur] = useInputValue({
    value,
    onChange,
    format,
    parse,
    isEqual: primitiveEquality
  });

  return (
    <input
      {...props}
      type="text"
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      onFocus={(event) => {
        onFocus();
        props.onFocus?.(event);
      }}
      onBlur={(event) => {
        onBlur();
        props.onBlur?.(event);
      }}
    />
  );
}
