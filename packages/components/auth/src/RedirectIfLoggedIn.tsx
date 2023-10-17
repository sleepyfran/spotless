import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { Loader, Paths } from "@spotless/components-shared";
import { AuthLayout } from "./AuthLayout";
import { reactiveComponent } from "react-rx";
import { combineLatest, map } from "rxjs";
import { useAuthStatus } from "./hooks";

/**
 * Wraps a component and only shows it if the user is not currently authenticated
 * correctly. Otherwise, shows the root page of the app.
 */
export const RedirectIfLoggedIn = reactiveComponent<PropsWithChildren>(
  ($props) => {
    const $authStatus = useAuthStatus();

    return combineLatest([$props, $authStatus]).pipe(
      map(([{ children }, status]) =>
        status === "loading" ? (
          <AuthLayout>
            <Loader />
          </AuthLayout>
        ) : status !== "authenticated" ? (
          <>{children}</>
        ) : (
          <Navigate to={Paths.root} />
        )
      )
    );
  }
);
