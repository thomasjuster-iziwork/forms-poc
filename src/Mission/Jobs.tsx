import React, { FunctionComponent, ReactNode, useCallback } from "react"
import { composeBusinessRules, composeErrors } from '../forms/helpers'
import { ListInput } from "../inputs"
import { MissionFormValues, MissionForm } from "./form"

const getSkeleton = () => ({ name: "", years: null })

type Props = {
  map: (value: MissionFormValues["jobs"][number], index: number) => ReactNode
}

const Input: FunctionComponent<Props> = ({ map }) => {
  const state = MissionForm.useFormState()
  const addRow = useCallback(() => {
    state.setValues({ jobs: [...state.values.jobs, getSkeleton()] })
  }, [state])

  return (
    <ListInput onAdd={addRow}>
      <div>{state.values.jobs.map(map)}</div>
    </ListInput>
  )
}

export const Jobs = {
  Input,
  businessRules: composeBusinessRules(),
  getError: composeErrors(),
}
