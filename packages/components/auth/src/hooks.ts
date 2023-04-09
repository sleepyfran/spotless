import { useData } from "@spotless/components-shared";
import { useLiveQuery } from "dexie-react-hooks";

export type AuthState = "loading" | "authenticated" | "unauthorized";

/**
 * Returns the current authentication state.
 */
export const useAuthState = (): AuthState => {
  const { auth } = useData();

  return useLiveQuery(
    () =>
      auth
        .authenticatedUser()
        .then((auth) => (auth ? "authenticated" : "unauthorized")),
    [],
    "loading"
  );
};
