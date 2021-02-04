import React, { useMemo } from "react";

export const Select = ({
  options,
  disabled = [],
  omitted = [],
  format = (value) => value,
  value,
  onChange,
  ...props
}) => {
  const filteredOptions = useMemo(() => {
    return options.filter(
      (option) => value === option || !omitted.includes(option)
    );
  }, [options, omitted, value]);

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    >
      <option value="">{"Select. This or that, me don’t care."}</option>
      {filteredOptions.map((option) => (
        <option
          key={option}
          value={option}
          disabled={value !== option && disabled.includes(option)}
        >
          {format(option)}
        </option>
      ))}
    </select>
  );
};
