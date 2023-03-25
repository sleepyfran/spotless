import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useStateKey, Paths } from "@spotless/component-shared";

/**
 * Wraps a component and only shows it if the user is not currently authenticated
 * correctly. Otherwise, shows the root page of the app.
 */
export const RedirectIfLoggedIn = ({ children }: PropsWithChildren) => {
  const authState = useStateKey("auth");

  return authState.__status === "unauthenticated" ? (
    <>{children}</>
  ) : (
    <Navigate to={Paths.root} />
  );
};
