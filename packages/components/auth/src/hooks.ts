import { useData } from "@spotless/components-shared";
import { useMemo } from "react";
import { Observable, map, startWith } from "rxjs";

type AuthStatus = "loading" | "not-authenticated" | "authenticated";

export const useAuthStatus = (): Observable<AuthStatus> => {
  const { auth } = useData();
  const authenticatedUser = useMemo(() => auth.authenticatedUser(), [auth]);
  return authenticatedUser.pipe(
    map(
      (user) =>
        (user?.__type === "AuthenticatedUser"
          ? "authenticated"
          : "not-authenticated") as AuthStatus
    ),
    startWith("loading" as AuthStatus)
  );
};
