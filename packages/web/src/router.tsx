import { createBrowserRouter, Outlet } from "react-router-dom";
import {
  AuthLanding,
  AuthCallback,
  RequireLogin,
  RedirectIfLoggedIn,
} from "@spotless/components-auth";
import { ArtistsPage } from "@spotless/components-artists";
import { AlbumsPage } from "@spotless/components-albums";
import { Paths } from "@spotless/components-shared";
import { Root } from "@spotless/components-root";
import { HomePage } from "@spotless/components-home";
import { Title, Text, Flex } from "@mantine/core";

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
        element: (
          <Flex direction="column">
            <Title>Genres</Title>
            <Text>Coming soon</Text>
          </Flex>
        ),
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
        path: Paths.auth.callback,
        element: <AuthCallback />,
      },
    ],
  },
]);
