import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Subscribe } from "@react-rxjs/core";
import { ServiceContext, initialize } from "./service-context";
import { AuthLanding, ProcessAuthCallback } from "./auth/Auth";
import { RequireLogin } from "./auth/RequireLogin";

import "./index.css";
import "./App.css";
import { RedirectIfLoggedIn } from "./auth/RedirectIfLoggedIn";

const router = createBrowserRouter([
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

const services = initialize({
  baseUrl: import.meta.env.VITE_BASE_APP,
  clientId: import.meta.env.VITE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET,
});

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Subscribe>
    <ServiceContext.Provider value={services}>
      <RouterProvider router={router} />
    </ServiceContext.Provider>
  </Subscribe>
);
