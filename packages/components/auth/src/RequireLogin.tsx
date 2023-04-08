import { PropsWithChildren } from "react";
import { AuthLanding, AuthLayout } from "./Auth";
import { useData } from "@spotless/components-shared";
import { useLiveQuery } from "dexie-react-hooks";
import { Loader } from "@mantine/core";

type AuthState = "loading" | "authenticated" | "unauthorized";

/**
 * Wraps a component and only shows it if the user is currently authenticated
 * correctly. Otherwise, shows the auth landing.
 */
export const RequireLogin = ({ children }: PropsWithChildren) => {
  const { auth } = useData();

  const authenticatedUser: AuthState = useLiveQuery(
    () =>
      auth
        .authenticatedUser()
        .then((auth) => (auth ? "authenticated" : "unauthorized")),
    [],
    "loading"
  );

  return authenticatedUser === "loading" ? (
    <AuthLayout>
      <Loader size="xl" />
    </AuthLayout>
  ) : authenticatedUser === "authenticated" ? (
    <>{children}</>
  ) : (
    <AuthLanding />
  );
};
