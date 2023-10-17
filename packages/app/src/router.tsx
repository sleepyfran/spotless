import { createHashRouter, Outlet } from "react-router-dom";
import { Paths } from "@spotless/components-shared";
import {
  AuthLanding,
  RedirectIfLoggedIn,
  RequireLogin,
} from "@spotless/components-auth";
import { AuthCallback } from "@spotless/components-auth/src/Auth";

export const createRouter = () =>
  createHashRouter([
    {
      path: Paths.root,
      element: (
        <RequireLogin>
          <Outlet />
        </RequireLogin>
      ),
      children: [
        {
          path: "/",
          element: <h1>Halo</h1>,
        },
      ],
    },
    {
      path: Paths.auth.root,
      element: (
        <RedirectIfLoggedIn>
          <Outlet />
        </RedirectIfLoggedIn>
      ),
      children: [
        {
          path: Paths.auth.root,
          element: <AuthLanding />,
        },
        {
          path: Paths.auth.callback,
          element: <AuthCallback />,
        },
      ],
    },
  ]);
