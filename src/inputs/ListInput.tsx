import React, { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = ComponentPropsWithoutRef<'div'> & {
  onAdd: () => void;
};

export const ListInput = forwardRef<HTMLDivElement, Props>(({ children, onAdd, ...props }, ref) => {
  return (
    <div {...props} ref={ref}>
      <div>{children}</div>
      <button onClick={() => onAdd()}>+</button>
    </div>
  );
});
