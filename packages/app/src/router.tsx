import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthLanding, ProcessAuthCallback } from "./auth/Auth";
import { RequireLogin } from "./auth/RequireLogin";
import { RedirectIfLoggedIn } from "./auth/RedirectIfLoggedIn";

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
        <h1>Welcome!</h1>
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
