import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { Paths } from "@spotless/components-shared";
import { useAuthState } from "./hooks";
import { AuthLayout } from "./Auth";
import { Loader } from "@mantine/core";

/**
 * Wraps a component and only shows it if the user is not currently authenticated
 * correctly. Otherwise, shows the root page of the app.
 */
export const RedirectIfLoggedIn = ({ children }: PropsWithChildren) => {
  const authState = useAuthState();

  return authState === "loading" ? (
    <AuthLayout>
      <Loader size="xl" />
    </AuthLayout>
  ) : authState !== "authenticated" ? (
    <>{children}</>
  ) : (
    <Navigate to={Paths.root} />
  );
};
