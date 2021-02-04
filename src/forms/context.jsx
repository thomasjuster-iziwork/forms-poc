// Declare React provider

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState
} from "react";
import { compose, formActions, formReducer } from "./state";

const useArrayState = (defaultValue) => {
  const [array, setArray] = useState(defaultValue);
  const append = useCallback((value) => {
    setArray((prev) => [...prev, value]);
  }, []);
  const remove = useCallback((value) => {
    setArray((prev) => prev.filter((v) => v !== value));
  }, []);
  return [array, append, remove];
};

export const useForm = (initialState, customReducer) => {
  const [fields, appendField, removeField] = useArrayState([]);
  const validate = useCallback(
    (values) =>
      fields
        .map(({ getError, domNode }) => ({
          errors: getError(values),
          domNode: domNode.current
        }))
        .filter(({ errors }) => !!errors?.length),
    [fields]
  );

  const applyFieldsRules = useMemo(
    () => fields.map(({ applyRules }) => applyRules).filter(Boolean),
    [fields]
  );

  const reducer = useMemo(
    () => compose(...applyFieldsRules, customReducer, formReducer),
    [customReducer, applyFieldsRules]
  );
  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = useMemo(
    () => ({
      changeValue: (...args) => dispatch(formActions.changeValue(...args)),
      changeListValue: (...args) =>
        dispatch(formActions.changeListValue(...args)),
      initialize: (...args) => dispatch(formActions.initialize(...args))
    }),
    [dispatch]
  );

  return {
    values: state,
    actions,
    appendField,
    removeField,
    validate
  };
};

export const makeFormContext = () => {
  const Context = createContext(null);
  const useFormContext = () => {
    const context = useContext(Context);
    if (context === null) {
      throw new Error("form context should not be null");
    }
    return context;
  };

  const useField = (field) => {
    const { domNode, getError, applyRules } = field;
    const { appendField, removeField, ...context } = useFormContext();

    useEffect(() => {
      const newField = { domNode, getError, applyRules };
      appendField(newField);
      return () => {
        removeField(newField);
      };
    }, [domNode, getError, applyRules, appendField, removeField]);

    return context;
  };
  return { FormProvider: Context.Provider, useFormContext, useField };
};
