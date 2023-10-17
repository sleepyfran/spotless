import { PropsWithChildren } from "react";
import { AuthLanding } from "./Auth";
import { AuthLayout } from "./AuthLayout";
import { Loader } from "@spotless/components-shared";

/**
 * Wraps a component and only shows it if the user is currently authenticated
 * correctly. Otherwise, shows the auth landing.
 */
export const RequireLogin = ({ children }: PropsWithChildren) => {
  const authState = "loading";

  return authState === "loading" ? (
    <AuthLayout>
      <Loader />
    </AuthLayout>
  ) : authState === "authenticated" ? (
    <>{children}</>
  ) : (
    <AuthLanding />
  );
};
