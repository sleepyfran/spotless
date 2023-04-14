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
 * Represents a album, which contains the basic metadata to display
 * it inside of a list.
 */
export type Album = {
  id: string;
  name: string;
  artistName: string;
  coverUrl: string;
  addedAt: Date;
};

/**
 * Represents a artist, which contains the basic metadata to display it
 * inside of a list.
 */
export type Artist = {
  id: string;
  name: string;
  imageUrl: string;
};

export type CurrentlyPlaying = {
  artistName: string;
  albumName: string;
  trackName: string;
  trackLength: number;
  coverUrl: string;
};

/**
 * Represents the current state of the player.
 */
export type PlayerState = {
  currentlyPlaying: CurrentlyPlaying | undefined;
  paused: boolean;
  shuffle: boolean;
  positionInMs: number;
};
