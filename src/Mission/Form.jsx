import React, { useEffect } from "react";
import { useForm, makeFormContext } from "../forms/context";
import { initialState } from "./businessRules";

const { FormProvider, useFormContext, useField } = makeFormContext();
export { useFormContext, useField };

export default function MissionForm({ children }) {
  const formContext = useForm(initialState);
  const { initialize } = formContext.actions;
  useEffect(() => {
    setTimeout(() => {
      const today = new Date();
      const afterTomorrow = new Date();
      afterTomorrow.setDate(afterTomorrow.getDate() + 2);

      initialize({
        startDate: today && undefined,
        endDate: afterTomorrow,
        duration: 12,
        ssn: "299239923923921",
        jobs: [
          { name: "Explorer", years: 10 },
          { name: "Investor", years: 5 },
          { name: "Agricultor", years: 8 }
        ]
      });
    }, 1000);
  }, [initialize]);

  return (
    <FormProvider value={formContext}>{children(formContext)}</FormProvider>
  );
}
