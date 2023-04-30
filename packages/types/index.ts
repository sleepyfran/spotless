export * as AlbumMappers from "./src/album-mappers";

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
 * Represents a track, which contains the basic metadata to display
 * it inside of a list.
 */
export type Track = {
  id: string;
  name: string;
  trackNumber: number;
  lengthInMs: number;
};

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
  releaseDate: Date;
  totalTracks: number;
  trackList: Track[];
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

/**
 * Represents all playable items.
 */
export type Playable = Album;

/**
 * Represents a track inside of a queued album.
 */
export type QueuedAlbumTrack = {
  id: string;
  name: string;
  lengthInMs: number;
  played: boolean;
};

/**
 * Represents an album that has been queued.
 */
export type QueuedAlbum = {
  id: string;
  name: string;
  artistName: string;
  coverUrl: string;
  trackList: QueuedAlbumTrack[];
  played: boolean;
};

/**
 * Represents a track that is currently being played.
 */
export type CurrentlyPlaying = QueuedAlbumTrack & {
  album: Omit<QueuedAlbum, "trackList">;
};

/**
 * Represents the current state of the player.
 */
export type PlayerState = {
  currentlyPlaying: CurrentlyPlaying | undefined;
  queue: QueuedAlbum[];
  volume: number;
  paused: boolean;
  shuffle: boolean;
  positionInMs: number;
};
