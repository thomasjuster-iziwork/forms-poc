import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  FormState,
  FormActions,
  FormIndicators,
  FormField,
  GetError,
  FormFieldName
} from "./interfaces";
import * as actions from "./actions";
import * as indicators from "./indicators";

type ValuesShape = Record<string, any>;
type FormContext<Values extends ValuesShape> = FormState<Values> &
  FormActions<Values> &
  FormIndicators;

export const makeContext = <Values extends ValuesShape>() => {
  const Context = createContext<Values | null>(null);

  const useFormContext = () => {
    const context = useContext(Context);
    if (!context) throw new Error("context cannot be null");
    return context;
  };

  const useForm = (initialValues: Values): FormContext<Values> => {
    const [state, setState] = useState<FormState<Values>>({
      initialValues,
      values: initialValues,
      errors: {},
      fields: []
    });

    const formActions: FormActions<Values> = useMemo(
      () => ({
        ...state,
        initialize: (values: Values) =>
          setState(actions.initialize(state)(values)),
        setValues: (values: Values) =>
          setState(actions.setValues(state)(values)),
        setListValue: <Key extends keyof Values>(
          field: Key,
          index: number,
          value: Values[Key][number]
        ) => setState(actions.setListValue(state)(field, index, value)),
        registerField: (field: FormField<Values>) =>
          setState(actions.registerField(state)(field)),
        unregisterField: (field: FormField<Values>) =>
          setState(actions.unregisterField(state)(field))
      }),
      [state]
    );
    const formIndicators: FormIndicators = useMemo(
      () => ({
        isDirty: (path?: string) => indicators.isDirty(state)(path)
      }),
      [state]
    );

    return useMemo(
      () => ({
        ...state,
        ...formActions,
        ...formIndicators
      }),
      [state, formActions, formIndicators]
    );
  };

  const FormProvider = Context.Provider;

  const useFormField = (name: FormFieldName, getError: GetError<Values>) => {
    const state = useFormContext();
    // if (!_.get(state.values, name)) throw new Error(`no value matching name "${name}"`);
    const domNodeRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
      const field = { name, getError, domNodeRef };
      state.registerField(field);
      return () => {
        state.unregisterField(field);
      };
    }, [name, getError, state]);

    return { domNodeRef };
  };

  return { useFormContext, useForm, FormProvider, useFormField };
};
