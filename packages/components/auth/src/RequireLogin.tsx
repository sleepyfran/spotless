import { PropsWithChildren } from "react";
import { AuthLanding, AuthLayout } from "./Auth";

import { Loader } from "@mantine/core";
import { useAuthState } from "./hooks";

/**
 * Wraps a component and only shows it if the user is currently authenticated
 * correctly. Otherwise, shows the auth landing.
 */
export const RequireLogin = ({ children }: PropsWithChildren) => {
  const authState = useAuthState();

  return authState === "loading" ? (
    <AuthLayout>
      <Loader size="xl" />
    </AuthLayout>
  ) : authState === "authenticated" ? (
    <>{children}</>
  ) : (
    <AuthLanding />
  );
};
