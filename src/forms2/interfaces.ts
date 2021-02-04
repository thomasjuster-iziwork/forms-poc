export type FormFieldName = string;
export type FormFieldError = string | null;
export type FormField<Values> = {
  domNode: HTMLElement; // needed, it is used to scroll programmatically to field when clicking on error message
  name: FormFieldName;
  getError: (values: Values) => FormFieldError;
};
export type FormErrors = Record<FormFieldName, FormFieldError>;

export type FormValuesShape = Record<string, any>;

export type FormState<Values extends FormValuesShape> = {
  initialValues: Values;
  values: Values;
  errors: FormErrors;
  fields: Array<FormField<Values>>;
};

export type FormActions<Values extends FormValuesShape> = {
  initialize: (values: Values) => void;
  setValues: (values: Values) => void;
  setListValue: <Key extends keyof Values>(
    field: Key,
    index: number,
    value: Values[Key][number]
  ) => void;
  // register fields to retrieve validation defined at field-level
  registerField: (field: FormField<Values>) => void;
  unregisterField: (field: FormField<Values>) => void;
};

export type FormIndicators = {
  isDirty: (path?: string) => boolean;
};

export type BusinessRule<Values extends FormValuesShape> = (
  previousValues: Values,
  currentValues: Values
) => Values;

export type GetError<Values extends FormValuesShape> = (
  values: Values
) => FormFieldError;
