import React from "react";
import { makeUseInputValue } from "./useInputValue";

const isEqual = (a, b) =>
  a?.toISOString().slice(0, 10) === b?.toISOString().slice(0, 10);
const format = (date) => {
  // console.info("date", date);
  return date?.toISOString()?.slice(0, 10);
};
const parse = (str) => {
  switch (str?.toLowerCase()) {
    case "today":
      const today = new Date();
      return today;
    case "tomorrow":
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    default:
      const date = new Date(str);
      return date.toString() === "Invalid Date" ? null : date;
  }
};

const useInputValue = makeUseInputValue({
  format,
  isEqual,
  parse
});

export default function DateInput({ value, onChange, ...props }) {
  const [inputValue, setInputValue, onFocus, onBlur] = useInputValue({
    value,
    onChange
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
