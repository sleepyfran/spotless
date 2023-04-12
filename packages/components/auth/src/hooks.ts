import { useData } from "@spotless/components-shared";
import { bind } from "@react-rxjs/core";
import { AuthData } from "@spotless/data-auth";
import { map } from "rxjs";

export type AuthState = "loading" | "authenticated" | "unauthorized";

const [useAuthState$] = bind(
  (auth: AuthData) =>
    auth
      .authenticatedUser()
      .pipe(map((auth) => (auth ? "authenticated" : "unauthorized"))),
  "loading"
);

/**
 * Returns the current authentication state.
 */
export const useAuthState = (): AuthState => {
  const { auth } = useData();
  return useAuthState$(auth);
};
