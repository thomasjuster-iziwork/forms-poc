import React, { forwardRef, ReactNode } from "react";

type Props = {
  label: ReactNode;
  control: ReactNode;
  error?: string | null;
};
export type FieldProps = Props;

export const Field = forwardRef<HTMLDivElement, Props>(({ label, control, error }, ref) => {
  return (
    <div className="field" ref={ref}>
      {label && <div>{label}</div>}
      <div>{control}</div>
      {error && <small>{error}</small>}
    </div>
  );
});
