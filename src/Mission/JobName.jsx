import React from "react";
import Field from "../Field";
import { Select } from "../inputs/Select";
import { useFormContext } from "./Form";

const options = ["Explorer", "Administrator", "Banker"];
const translations = {
  Explorer: "Explorateur",
  Administrator: "Administrateur",
  Banker: "Banquier"
};
const display = (value) => translations[value] || "no translation :/";

// 'Administrator' option can be selected multiple times.
const getDisabledOptions = (pickedJobNames) =>
  pickedJobNames.filter((option) => option !== "Administrator");

const Input = ({ index, label, ...props }) => {
  const { values, actions } = useFormContext();

  return (
    <Field
      label={label || "Name"}
      control={
        <Select
          format={display}
          disabled={getDisabledOptions(values.jobs.map((job) => job.name))}
          omitted={getDisabledOptions(values.jobs.map((job) => job.name))}
          options={options}
          value={values.jobs[index].name}
          onChange={(jobName) =>
            actions.changeListValue("jobs", index, {
              ...values.jobs[index],
              name: jobName
            })
          }
          {...props}
        />
      }
    />
  );
};

export const JobName = {
  Input,
  display,
  getDisabledOptions,
  options,
  getOptionLabel: () => {}
};
