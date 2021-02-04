import React, { useCallback } from "react";
import { ListInput } from "../inputs/ListInput";
import { useFormContext } from "./Form";

const getSkeleton = () => ({ name: "", years: null });

const Input = ({ map }) => {
  const { values, actions } = useFormContext();
  const addRow = useCallback(() => {
    actions.changeValue("jobs", [...values.jobs, getSkeleton()]);
  }, [values.jobs, actions]);

  return (
    <ListInput onAdd={addRow}>
      <div>{values.jobs.map(map)}</div>
    </ListInput>
  );
};

export const Jobs = {
  Input
};
