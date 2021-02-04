import React, { FunctionComponent } from "react";
import { composeBusinessRules, composeErrors } from '../forms/helpers'
import { Select, Field, FieldProps } from "../inputs";
import { MissionForm, MissionFormValues } from './form'

type Option = NonNullable<MissionFormValues['jobs'][number]['name']>;
const options: Option[] = ["Explorer", "Administrator", "Banker"];

const translations: Record<Option, string> = {
  Explorer: "Explorateur",
  Administrator: "Administrateur",
  Banker: "Banquier"
} as const;

const formatJobName = (option: Option) => translations[option] || "no translation :/";
const parseJobName = (option: string): Option | null => (!option || option === "no translation :/") ? null : option;
const isJobNameEqual = (a: Option | null, b: Option | null) => a !== b;

// 'Administrator' option can be selected multiple times.
const getDisabledOptions = (pickedJobNames: Array<Option | null>): Option[] =>
  pickedJobNames.filter((option) => option !== "Administrator").filter(Boolean) as Option[];

type Props = Partial<FieldProps> & { index: number; }

const Input: FunctionComponent<Props> = ({ index, label, ...props }) => {
  const { domNodeRef, state } = MissionForm.useFormField(`jobs.${index}.name`, JobName.getError);

  return (
    <Field
      ref={domNodeRef}
      label={label || "Name"}
      control={
        <Select
          format={formatJobName}
          parse={parseJobName}
          isEqual={isJobNameEqual}
          disabled={getDisabledOptions(state.values.jobs.map((job) => job.name))}
          omitted={getDisabledOptions(state.values.jobs.map((job) => job.name))}
          options={options}
          value={state.values.jobs[index].name}
          onChange={(jobName) =>
            state.setListValue("jobs", index, {
              ...state.values.jobs[index],
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
  formatLabel: formatJobName,
  getError: composeErrors(),
  businessRules: composeBusinessRules(),
  getDisabledOptions,
  options,
  getOptionLabel: () => {}
};
