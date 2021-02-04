import { GetError, BusinessRule, FormValuesShape } from "./interfaces";

export const composeErrors = <Values extends FormValuesShape>(
  ...getErrorFunctions: Array<GetError<Values>>
) => (values: Values) => {
  for (const getError of getErrorFunctions.filter(Boolean)) {
    const error = getError(values);
    if (error) return error;
  }
  return null;
};
// hello world;
export const composeBusinessRules = <Values extends FormValuesShape>(
  ...businessRuleFunctions: Array<
    BusinessRule<Values> | undefined | null | false
  >
) => (previousValues: Values, currentValues: Values) => {
  const filtered = businessRuleFunctions.filter(Boolean) as Array<
    BusinessRule<Values>
  >;
  return filtered.reduceRight(
    (nextValues, applyRule) => applyRule(previousValues, nextValues),
    currentValues
  );
};

export const applyBusinessRule = <Values extends FormValuesShape>(
  businessRule: BusinessRule<Values>,
  maxIterations = 10,
  count = 1
) => {
  return (previousValues: Values, currentValues: Values): Values => {
    if (count > maxIterations) throw new Error("too many iterations");
    const nextValues = businessRule(previousValues, currentValues);
    return nextValues === currentValues
      ? nextValues
      : applyBusinessRule(
          businessRule,
          maxIterations,
          count + 1
        )(currentValues, nextValues);
  };
};
