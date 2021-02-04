import React, { forwardRef } from "react";

const Field = forwardRef(({ label, control, error }, ref) => {
  return (
    <div className="field" ref={ref}>
      {label && <div>{label}</div>}
      <div>{control}</div>
      {error && <small>{error}</small>}
    </div>
  );
});

export const getFirstError = (...errors) => errors.find((error) => !!error);

export default Field;
