import { createBrowserRouter, Outlet } from "react-router-dom";
import {
  AuthLanding,
  ProcessAuthCallback,
  RequireLogin,
  RedirectIfLoggedIn,
} from "@spotless/components-auth";
import { Paths } from "@spotless/components-shared";
import { Root } from "@spotless/components-root";
import { Home } from "@spotless/components-home";
import { Title } from "@mantine/core";

export const router = createBrowserRouter([
  {
    path: Paths.root,
    element: (
      <RequireLogin>
        <Root>
          <Outlet />
        </Root>
      </RequireLogin>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: Paths.artists,
        element: <Title>Artists</Title>,
      },
      {
        path: Paths.albums,
        element: <Title>Albums</Title>,
      },
      {
        path: Paths.genres,
        element: <Title>Genres</Title>,
      },
      {
        path: Paths.explore,
        element: <Title>Explore</Title>,
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
