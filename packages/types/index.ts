/**
 * Holds the secrets and settings that are passed from environment variables.
 */
export type AppConfig = {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
};

/**
 * Gathers the information about the currently authenticated user.
 */
export type AuthenticatedUser = {
  __type: "AuthenticatedUser";
  accessToken: string;
  tokenType: string;
  scope: string;
  expirationTimestamp: number;
  refreshToken: string;
};

/**
 * Default state for the auth user.
 */
export type UnauthorizedUser = {
  __type: "UnauthorizedUser";
};

export type AuthUser = AuthenticatedUser | UnauthorizedUser;

/**
 * Represents a simple album, which contains the basic metadata to display
 * it inside of a list.
 */
export type SimpleAlbum = {
  id: string;
  name: string;
  artistName: string;
  coverUrl: string;
};

/**
 * Represents a simple artist, which contains the basic metadata to display it
 * inside of a list.
 */
export type SimpleArtist = {
  id: string;
  name: string;
  imageUrl: string;
};
