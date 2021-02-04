import { applyBusinessRule } from './helpers'
import {
  BusinessRule,
  FormErrors,
  FormField,
  FormState,
  FormValuesShape
} from "./interfaces";

const fromEntries = <K extends string, V extends any>(
  entries: Array<[K, V]>
): Record<K, V> =>
  Object.assign({}, ...entries.map(([key, value]) => ({ [key]: value })));

export const harvestErrors = <Values extends FormValuesShape>(
  fields: Array<FormField<Values>>,
  values: Values
): FormErrors => {
  const entries = fields
    .map(({ name, getError }) => {
      const error = getError(values);
      return error ? [name, error] : null;
    })
    .filter(Boolean) as Array<[string, string]>;

  return fromEntries(entries);
};

export const initialize = <Values extends FormValuesShape>(
  state: FormState<Values>
) => (values: Values): FormState<Values> => {
  return {
    ...state,
    values,
    initialValues: values,
    errors: harvestErrors(state.fields, values)
  };
};

const noopBusinessRule: BusinessRule<any> = (_prev, current) => current;

export const setValues = <Values extends FormValuesShape>(
  state: FormState<Values>,
  businessRule: BusinessRule<Values> = noopBusinessRule,
) => (values: Partial<Values>): FormState<Values> => {
  const nextValues = { ...state.values, ...values };
  return {
    ...state,
    values: applyBusinessRule(businessRule)(state.values, nextValues),
    errors: harvestErrors(state.fields, nextValues)
  };
};

export const setListValue = <Values extends FormValuesShape>(
  state: FormState<Values>,
  businessRule: BusinessRule<Values> = noopBusinessRule,
) => <Key extends keyof Values>(
  field: Key,
  index: number,
  value: Values[Key][number]
): FormState<Values> => {
  const nextValues = { ...state.values };
  (nextValues[field] as any[]) = [...nextValues[field]];
  nextValues[field][index] = value;

  return {
    ...state,
    values: applyBusinessRule(businessRule)(state.values, nextValues),
    errors: harvestErrors(state.fields, nextValues)
  };
};

export const registerField = <Values extends FormValuesShape>(
  state: FormState<Values>
) => (field: FormField<Values>) => {
  const nextFields = [...state.fields, field];
  return state.fields.includes(field)
    ? state
    : {
        ...state,
        fields: nextFields,
        errors: harvestErrors(nextFields, state.values)
      };
};

export const unregisterField = <Values extends FormValuesShape>(
  state: FormState<Values>
) => (field: FormField<Values>) => {
  const { [field.name]: keyToRemove, ...nextErrors } = state.errors;
  return !state.fields.includes(field) && !keyToRemove
    ? state
    : {
        ...state,
        fields: state.fields.filter(
          (registeredField) => registeredField !== field
        ),
        errors: nextErrors
      };
};
