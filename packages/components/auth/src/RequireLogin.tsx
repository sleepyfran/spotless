import { PropsWithChildren } from "react";
import { AuthLanding } from "./Auth";
import { AuthLayout } from "./AuthLayout";
import { Loader } from "@spotless/components-shared";
import { reactiveComponent } from "react-rx";
import { combineLatest, map } from "rxjs";
import { useAuthStatus } from "./hooks";

/**
 * Wraps a component and only shows it if the user is currently authenticated
 * correctly. Otherwise, shows the auth landing.
 */
export const RequireLogin = reactiveComponent<PropsWithChildren>(($props) => {
  const $authStatus = useAuthStatus();

  return combineLatest([$props, $authStatus]).pipe(
    map(([{ children }, status]) =>
      status === "loading" ? (
        <AuthLayout>
          <Loader />
        </AuthLayout>
      ) : status === "authenticated" ? (
        <>{children}</>
      ) : (
        <AuthLanding />
      )
    )
  );
});
