import { createHashRouter, Outlet } from "react-router-dom";

export const createRouter = () =>
  createHashRouter([
    {
      path: "",
      element: <Outlet />,
      children: [
        {
          path: "/",
          element: <div>Halo</div>,
        },
      ],
    },
    {
      path: "auth",
      element: <Outlet />,
      children: [],
    },
  ]);
