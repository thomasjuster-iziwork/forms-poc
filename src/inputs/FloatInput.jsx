import React from "react";
import { makeUseInputValue } from "./useInputValue";

const floatIsEqual = (a, b) => a === b;
const customFormatFloat = (n) => (n ? `${n.toLocaleString("fr-FR")}` : "");
const customParseFloat = (n) => {
  const asString = (n || "").replace(/\s/g, "").replace(",", ".");
  const number = Number(asString);
  return Number.isNaN(number) || n === "" ? null : number;
};
const useFloatValue = makeUseInputValue({
  format: customFormatFloat,
  parse: customParseFloat,
  isEqual: floatIsEqual
});

export default function FloatInput({ value, onChange, ...props }) {
  const [inputValue, setInputValue, onFocus, onBlur] = useFloatValue({
    value,
    onChange
  });
  return (
    <input
      type="text"
      onFocus={(event) => {
        onFocus();
        props.onFocus?.(event);
      }}
      onBlur={(event) => {
        onBlur();
        props.onBlur?.(event);
      }}
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      {...props}
    />
  );
}
