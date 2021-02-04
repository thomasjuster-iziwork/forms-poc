export const composeRules = (...applyRules) => {
  return (prevState, currentState) => {
    return applyRules
      .filter(Boolean)
      .reduceRight(
        (nextState, applyRule) => applyRule(prevState, nextState),
        currentState
      );
  };
};

export const applyRule = (apply, threshold = 10, count = 1) => {
  return (prevState, currentState) => {
    if (count > threshold) throw new Error("too many updates");
    const nextState = apply(prevState, currentState);
    return nextState === currentState
      ? nextState
      : applyRule(apply, threshold, count + 1)(currentState, nextState);
  };
};

const makeHelpers = (prev, next) => ({
  hasChanged: (key) => prev[key] !== next[key],
  isDefined: (key) => next[key] !== undefined && next[key] !== null,
  and: (...fns) => (key) => fns.every((fn) => fn(key))
});

const updateCountry = (prev, next) => {
  const { hasChanged, isDefined, and } = makeHelpers(prev, next);
  const nameChanged = and(hasChanged, isDefined)("name");
  const nextCountryIsDifferent = next.country !== "fr-FR";
  const shouldUpdate = nameChanged && nextCountryIsDifferent;
  return shouldUpdate
    ? {
        ...next,
        country: "fr-FR"
      }
    : next;
};
const updateLanguage = (prev, next) => {
  const { and, hasChanged, isDefined } = makeHelpers(prev, next);
  const countryChanged = and(hasChanged, isDefined)("country");
  const nextLocale = next.country?.slice(0, 2);
  const nextLocaleIsDifferent = nextLocale !== next.locale;
  const shouldUpdate = countryChanged && nextLocaleIsDifferent;
  return shouldUpdate
    ? {
        ...next,
        locale: nextLocale
      }
    : next;
};
const applyRules = applyRule(composeRules(updateLanguage, updateCountry));

const prev = {
  name: "",
  country: "en-US",
  locale: "en"
};
const current = {
  name: "Thomas",
  country: "en-US",
  locale: "en"
};
const next = applyRules(prev, current);
console.assert(next.name === "Thomas", 'name should be "Thomas"');
console.assert(next.country === "fr-FR", 'country should be "fr-FR"');
console.assert(next.locale === "fr", 'locale should be "fr"');
console.info("OK");
