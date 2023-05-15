import { createHashRouter, Outlet } from "react-router-dom";
import {
  AuthLanding,
  AuthCallback,
  RequireLogin,
  RedirectIfLoggedIn,
} from "@spotless/components-auth";
import { Data } from "@spotless/services-bootstrap";
import { ArtistPageRoute, ArtistsPage } from "@spotless/components-artists";
import { AlbumsPage } from "@spotless/components-albums";
import { Paths } from "@spotless/components-shared";
import { Root } from "@spotless/components-root";
import { HomePage } from "@spotless/components-home";
import { firstValueFrom } from "rxjs";

export const createRouter = ({ artists }: Data) =>
  createHashRouter(
    [
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
            children: [
              {
                path: "",
                element: <ArtistsPage />,
              },
              {
                path: ":artistId",
                loader: ({ params }) =>
                  // The ID is guaranteed to be present because of the route definition.
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  firstValueFrom(artists.byId(params.artistId!)),
                element: <ArtistPageRoute />,
              },
            ],
          },
          {
            path: Paths.albums,
            element: <AlbumsPage />,
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
    ],
    {
      basename: import.meta.env.VITE_BASENAME,
    }
  );
