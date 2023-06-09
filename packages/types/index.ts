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

export type Id = string;

/**
 * Represents a track, which contains the basic metadata to display
 * it inside of a list.
 */
export type Track = {
  id: Id;
  name: string;
  trackNumber: number;
  lengthInMs: number;
};

/**
 * Represents the type of an album.
 */
export enum AlbumType {
  Album = "album",
  EP = "ep",
  Single = "single",
}

/**
 * Represents a genre of an album.
 */
export type Genre = string;

/**
 * Represents a genre of an album that is stored separately and can be referenced.
 */
export type IndexedGenre = {
  id: Id;
  name: Genre;
};

/**
 * Represents a album, which contains the basic metadata to display
 * it inside of a list.
 */
export type Album = {
  id: Id;
  name: string;
  artistName: string;
  artistId: Id;
  type: AlbumType;
  coverUrl: string;
  addedAt: Date;
  releaseDate: Date;
  genres: Genre[];
  totalTracks: number;
  trackList: Track[];
  durationInMinutes: number;
};

/**
 * Represents a dictionary of albums grouped by their type.
 */
export type GroupedAlbums = {
  [AlbumType.Album]: Album[];
  [AlbumType.EP]: Album[];
  [AlbumType.Single]: Album[];
};

/**
 * Represents a artist, which contains the basic metadata to display it
 * inside of a list.
 */
export type Artist = {
  id: Id;
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
  id: Id;
  name: string;
  lengthInMs: number;
  played: boolean;
};

/**
 * Represents an album that has been queued.
 */
export type QueuedAlbum = {
  id: Id;
  name: string;
  artistName: string;
  coverUrl: string;
  trackList: QueuedAlbumTrack[];
  played: boolean;
};

/**
 * Represents the queue of albums that are upcoming.
 */
export type Queue = QueuedAlbum[];

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
  queue: Queue;
  volume: number;
  paused: boolean;
  shuffle: boolean;
  positionInMs: number;
};
