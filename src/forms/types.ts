import { FunctionComponent } from "react";

type Error = string;

export type GetError = <Values>(values: Values) => Error | null;
export type FormField<Props> = {
  Input: FunctionComponent<Props>;
  getError: (options: { required: boolean }) => GetError;
};
