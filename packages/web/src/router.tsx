import { createBrowserRouter, Outlet } from "react-router-dom";
import {
  AuthLanding,
  ProcessAuthCallback,
  RequireLogin,
  RedirectIfLoggedIn,
} from "@spotless/components-auth";
import { Title } from "@mantine/core";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireLogin>
        <Title>Well, hello there :^)</Title>
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
