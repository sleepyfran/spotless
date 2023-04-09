import { Observable } from "rxjs";

/**
 * Represents an observable that emits a single value and then completes.
 */
export type Single<T> = Observable<T>;

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
