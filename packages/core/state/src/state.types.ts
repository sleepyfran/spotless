export type AuthenticatedStatus = {
  __status: "authenticated";
  accessToken: string;
  tokenType: string;
  scope: string;
  expiresIn: number;
  refreshToken: string;
};

export type UnauthenticatedStatus = {
  __status: "unauthenticated";
};

export type AuthState = AuthenticatedStatus | UnauthenticatedStatus;

/**
 * Holds the shared application state.
 */
export type State = {
  auth: AuthState;
};
