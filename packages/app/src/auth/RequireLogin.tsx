import { PropsWithChildren } from "react";
import { AuthLanding } from "./Auth";
import { useStateKey } from "@spotless/component-shared";

/**
 * Wraps a component and only shows it if the user is currently authenticated
 * correctly. Otherwise, shows the auth landing.
 */
export const RequireLogin = ({ children }: PropsWithChildren) => {
  const authState = useStateKey("auth");

  return authState.__status === "authenticated" ? (
    <>{children}</>
  ) : (
    <AuthLanding />
  );
};
