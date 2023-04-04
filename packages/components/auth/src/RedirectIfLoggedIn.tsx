import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { Paths, useServices } from "@spotless/components-shared";

/**
 * Wraps a component and only shows it if the user is not currently authenticated
 * correctly. Otherwise, shows the root page of the app.
 */
export const RedirectIfLoggedIn = ({ children }: PropsWithChildren) => {
  const { authService } = useServices();
  const authenticated = authService.isAuthenticated();

  return !authenticated ? <>{children}</> : <Navigate to={Paths.root} />;
};
