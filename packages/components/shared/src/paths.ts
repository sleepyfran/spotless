import { Id } from "@spotless/types";

/**
 * Contains the routes for the application.
 */
export const Paths = {
  root: "/",
  artists: "/artists",
  artist: (id: Id) => `/artists/${id}`,
  albums: "/albums",
  auth: {
    root: "/auth",
    callback: "/auth/callback",
  },
  genres: "/genres",
};
