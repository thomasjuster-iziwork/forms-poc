import React from "react";
import Field from "../Field";
import FloatInput from "../inputs/FloatInput";
import { useFormContext } from "./Form";

const Input = ({ index, label, ...props }) => {
  const { values, actions } = useFormContext();

  return (
    <Field
      label={label || "Years"}
      control={
        <FloatInput
          value={values.jobs[index].years}
          onChange={(years) =>
            actions.changeListValue("jobs", index, {
              ...values.jobs[index],
              years
            })
          }
          {...props}
        />
      }
    />
  );
};

export const JobYears = {
  Input
};
