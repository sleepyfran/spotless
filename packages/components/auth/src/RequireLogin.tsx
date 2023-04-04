import { PropsWithChildren } from "react";
import { AuthLanding } from "./Auth";
import { useServices } from "@spotless/components-shared";

/**
 * Wraps a component and only shows it if the user is currently authenticated
 * correctly. Otherwise, shows the auth landing.
 */
export const RequireLogin = ({ children }: PropsWithChildren) => {
  const { authService } = useServices();
  const authenticated = authService.isAuthenticated();

  return authenticated ? <>{children}</> : <AuthLanding />;
};
