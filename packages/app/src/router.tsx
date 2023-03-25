import { createBrowserRouter, Outlet } from "react-router-dom";
import {
  AuthLanding,
  ProcessAuthCallback,
  RequireLogin,
} from "@spotless/component-auth";
import { RedirectIfLoggedIn } from "../../components/auth/src/RedirectIfLoggedIn";
import { Root } from "@spotless/component-layout";

export const Paths = {
  root: "/",
  auth: {
    root: "/auth",
    callback: "/auth/callback",
  },
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireLogin>
        <Root />
      </RequireLogin>
    ),
  },
  {
    path: "/auth",
    element: (
      <RedirectIfLoggedIn>
        <Outlet />
      </RedirectIfLoggedIn>
    ),
    children: [
      {
        path: "",
        element: <AuthLanding />,
      },
      {
        path: "callback",
        element: <ProcessAuthCallback />,
      },
    ],
  },
]);
