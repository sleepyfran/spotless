import { createHashRouter, Outlet } from "react-router-dom";
import { Paths } from "@spotless/components-shared";
import { AuthLanding } from "@spotless/components-auth";

export const createRouter = () =>
  createHashRouter([
    {
      path: Paths.root,
      element: <Outlet />,
      children: [
        {
          path: "/",
          element: <h1>Halo</h1>,
        },
      ],
    },
    {
      path: Paths.auth.root,
      element: <Outlet />,
      children: [
        {
          path: Paths.auth.root,
          element: <AuthLanding />,
        },
        {
          path: Paths.auth.callback,
          element: <h1>Oi!</h1>,
        },
      ],
    },
  ]);
