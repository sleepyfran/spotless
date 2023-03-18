import { bind } from "@react-rxjs/core";
import { AppState, State } from "@spotless/core";
import { useServices } from "./service-context";

const [_useStateKey] = bind(
  <K extends keyof State>({ state, key }: { state: AppState; key: K }) =>
    state.observe(key)
);

/**
 * Observes a key of the state.
 * @param key key to observe.
 */
export const useStateKey = <K extends keyof State>(key: K) => {
  const { state } = useServices();
  return _useStateKey({ state, key });
};
