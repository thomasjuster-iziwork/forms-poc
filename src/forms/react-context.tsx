import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  FormState,
  FormActions,
  FormIndicators,
  FormField,
  GetError,
  FormFieldName,
  BusinessRule,
} from "./interfaces"
import * as actions from "./actions"
import * as indicators from "./indicators"

type ValuesShape = Record<string, any>
type FormContext<Values extends ValuesShape> = FormState<Values> &
  FormActions<Values> &
  FormIndicators

export const makeForm = <Values extends ValuesShape>(
  businessRules: BusinessRule<Values>
) => {
  const Context = createContext<FormContext<Values> | null>(null)

  const useFormState = () => {
    const context = useContext(Context)
    if (!context) throw new Error("context cannot be null")
    return context
  }

  const useForm = (initialValues: Values): FormContext<Values> => {
    const [state, setState] = useState<FormState<Values>>({
      initialValues,
      values: initialValues,
      errors: {},
      fields: [],
    })

    const formActions: FormActions<Values> = useMemo(
      () => ({
        ...state,
        initialize: (values: Values) =>
          setState(actions.initialize(state)(values)),
        setValues: (values: Partial<Values>) =>
          setState(actions.setValues(state, businessRules)(values)),
        setListValue: <Key extends keyof Values>(
          field: Key,
          index: number,
          value: Values[Key][number]
        ) =>
          setState(
            actions.setListValue(state, businessRules)(field, index, value)
          ),
        registerField: (field: FormField<Values>) =>
          setState(actions.registerField(state)(field)),
        unregisterField: (field: FormField<Values>) =>
          setState(actions.unregisterField(state)(field)),
      }),
      [state]
    )
    const formIndicators: FormIndicators = useMemo(
      () => ({
        isDirty: (path?: string) => indicators.isDirty(state)(path),
      }),
      [state]
    )

    useEffect(() => {
      formActions.initialize(initialValues)
    }, [initialValues])

    return useMemo(
      () => ({
        ...state,
        ...formActions,
        ...formIndicators,
      }),
      [state, formActions, formIndicators]
    )
  }

  const Provider = Context.Provider

  const useFormField = (name: FormFieldName, getError: GetError<Values>) => {
    const state = useFormState()
    // if (!_.get(state.values, name)) throw new Error(`no value matching name "${name}"`);
    const domNodeRef = useRef<HTMLElement | any | null>(null)

    useEffect(() => {
      const hasField = state.fields.some((field) => field.name === name)
      if (hasField) {
        return
      }
      const getDomNode: FormField<any>["getDomNode"] = () => {
        if (!domNodeRef.current)
          throw new Error(
            `dom node not found for "${name}", did you register it?`
          )
        return domNodeRef.current
      }
      const field: FormField<Values> = { name, getError, getDomNode }
      state.registerField(field)
      return () => {
        state.unregisterField(field)
      }
    }, [name, getError, state])

    return useMemo(
      () => ({
        domNodeRef,
        state,
      }),
      [state]
    )
  }

  return { useFormState, useForm, Provider, useFormField }
}
