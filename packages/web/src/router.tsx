import { createBrowserRouter, Outlet } from "react-router-dom";
import {
  AuthLanding,
  RequireLogin,
  RedirectIfLoggedIn,
} from "@spotless/components-auth";
import { ArtistsPage } from "@spotless/components-artists";
import { AlbumsPage } from "@spotless/components-albums";
import { Paths } from "@spotless/components-shared";
import { Root } from "@spotless/components-root";
import { HomePage } from "@spotless/components-home";
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
        element: <HomePage />,
      },
      {
        path: Paths.artists,
        element: <ArtistsPage />,
      },
      {
        path: Paths.albums,
        element: <AlbumsPage />,
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
    path: Paths.auth,
    element: (
      <RedirectIfLoggedIn>
        <AuthLanding />
      </RedirectIfLoggedIn>
    ),
  },
]);
