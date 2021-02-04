import { DependencyList, useEffect, useState } from 'react'

type State<T> = {
  value: T | null;
  error: Error | null;
  status: 'pending' | 'resolved' | 'rejected';
};
export const usePromise = <T>(getPromise: () => Promise<T>, deps: DependencyList) => {
  const [state, setState] = useState<State<T>>({ value: null, error: null, status: 'pending' });
  useEffect(() => {
    getPromise()
      .then((value) => setState({ value, error: null, status: 'resolved' }))
      .catch((error) => setState({ error, value: null, status: 'rejected' }))
  }, deps);

  return [state.value, state.status === 'pending', state.error] as const;
};
