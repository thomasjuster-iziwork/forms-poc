import { FormIndicators, FormState, FormValuesShape } from "./interfaces";

export const isDirty = <Values extends FormValuesShape>(
  state: FormState<Values>
): FormIndicators["isDirty"] => (path?: string) => {
  // use lodash get and lodash is equal
  // return isEqual(get(state.initialValues, path), get(state.values, path));
  return state.initialValues !== state.values;
};
