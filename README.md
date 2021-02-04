[Sandbox](https://codesandbox.io/s/zealous-hawking-wd709)

# Forms

## Requirements

- [ ] Values must be _available_ at form level
- [ ] Validation state must be _available_ at form level
- [ ] Business rules must be _registered_ at form level
- [ ] Validation must be _defined_ at field level
- [ ] Display states must be accessible and maintainable
- [ ] Display states must be _defined_ at field level
- [ ] UI MUST BE DECOUPLED FROM FORM STATES

# Proposals

## Input

_Fixes "UI MUST BE DECOUPLED FROM FORM STATES" (part 1/x)_

_See `inputs/` folder_

Inputs must defined following the controlled pattern.

```tsx
export const TextInput: FunctionComponent<{
  value: string;
  onChange: (nextValue: string) => void;
}>;

export const DateInput: FunctionComponent<{
  value: Date | null;
  onChange: (nextValue: Date | null) => void;
}>;

export const FloatInput: FunctionComponent<{
  value: number | null;
  onChange: (nextValue: number | null) => void;
}>;
// etc.
```

If the value needs formatting, like numbers or dates, the invalid value will be null.

Those input components _only return `<input />` dom element_.

## Form context

### Values

In order to interact with values, the form context should provide the following API:

```tsx
type FormFieldName = string;
type FormFieldError = string | null;
type FormField<Values> = {
  domNode: HTMLElement; // needed, it is used to scroll programmatically to field when clicking on error message
  name: FormFieldName;
  getError: (values: Values) => FormFieldError;
};

type FormContext<Values> = {
  initialize: (values: Values) => void;
  setValues: (values: Values) => void;
  setListValue: <Key extends keyof Values>(
    field: Key,
    index: number,
    value: Values[Key][number]
  ) => void;
  values: Values;
  errors: Record<FormFieldName, FormFieldError>;

  // register fields to retrieve validation defined at field-level
  registerField: (field: FormField<Values>) => void;
  unregisterField: (field: FormField<Values>) => void;

  // other helpers if necessary
  isDirty: (path: string) => boolean;
};
```

### <FormField /> Component

Expose a (tested) FormField component that will register fields on mount and unregister them on unmount.

```tsx
// layouts/Field.tsx
export const Field = ({ control, label, error }) => (
  <div>
    <label>{label}</label>
    <div>{control}</div>
    {error && <small>{error}</small>}
  </div>
);

// forms/FormField.tsx
import { Field } from "layouts/Field";

// FormField is a "connected" Field
export const FormField = ({
  label,
  control,
  getError,
  businessRules,
}) => {
  // do the logic
  const … = useFormContext()
  // then render <Field … />
  return <Field … />
};
```

## Validation (get errors)

### Definition

A validator (`getError()`) is a function taking the values and returning a form field error (string or null).

```ts
type GetError<Values> = (values: Values) => FormFieldError;
```

### Architecture

Common validators _must_ be defined and tested in a dedicated folder.

```ts
const getRequiredError = (value: unknown) => value ? t('errors:required') : null

const getDateRangeError = (diffInDays: number) => (
  start: Date,
  end: Date
) => … ? t('errors:date_range', { start: '…', end: '…' }) : null

// etc.
```

Those validators must be then used at field level (see below).

A function `composeErrors(...getErrorFunctions)` _must_ be provided.

## Business Rules

### Definition

A business rule is a function able to update values based on others.

```ts
type BusinessRule<Values> = (
  previousValues: Values,
  currentValues: Values
) => Values;
```

If no operation is made, it _must_ return the current state intact (no mutation, no cloning, no nothing).

### Architecture

Common business rules _must_ be defined and tested in a dedicated folder.

```ts
export const updateStartDate = <Values, Key extends keyof Values>(
  values: Values,
  endDate: Key
) => {
  // …
  return values;
};
```

Those common business rules _must_ be used at field level (see below).

A function `composeBusinessRules(...businessRuleFunctions)` _must_ be provided.

## Display states

Display state are variable like "should I display that input ?", "is this input disabled ?", … and that's mainly it.

Those display states should be functions exposed at field level (see below).

It should _always_ expose names unrelated with the UI. ie: avoid `isHidden()` or `isVisible()`, instead use `isEditable()` or `isDisabled()`.

## Fields − Examples

### Mission Form − StartDate

```tsx
import React from "react";

const Input = () => …;

// display
const isDisabled = (values) => !values.missionName;

// validation
const isRequired = (values) => !!values.endDate;
const getError = composeErrors(
  (values) => getDateRangeError(1)(values.startDate, values.endDate),
  (values) => isRequired(values) ? getRequiredError(values.startDate) : null,
  // and so on.
);

// business rules
const updateOnEndDateChange = (prev, current) => {
  if (prev.endDate === current.endDate) return current;
  return {
    ...values,
    startDate: addDays(1)(current.endDate),
  }
};
const setToTodayWhenJobIs = (job) => (prev, current) => {
  if (prev.job === current.job) return current;
  if (current.job !== job) return current;
  return {
    ...values,
    startDate: new Date(),
  };
}
const businessRules = composeBusinessRules(
  (values) => updateOnEndDateChange(values),
  (values) => setToTodayWhenJobIs('cariste')(values),
);
```
