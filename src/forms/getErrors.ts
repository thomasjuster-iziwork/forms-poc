import { GetError } from "./types";

export const getErrors = (...getErrorFunctions: GetError[]): GetError => {
  return (values) => {
    for (const getError of getErrorFunctions.filter(Boolean)) {
      const error = getError(values);
      if (error) return error;
    }
    return null;
  };
};
