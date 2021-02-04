import React from "react";

export const ListInput = ({ children, onAdd, emptyItem = null }) => {
  return (
    <div>
      <div>{children}</div>
      <button onClick={() => onAdd(emptyItem)}>+</button>
    </div>
  );
};
