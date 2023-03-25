type AuthenticatedStatusState = {
  __status: "authenticated";
  accessToken: string;
  tokenType: string;
  scope: string;
  expiresIn: number;
  refreshToken: string;
};

type UnauthenticatedStatusState = {
  __status: "unauthenticated";
};

export type AuthState = AuthenticatedStatusState | UnauthenticatedStatusState;

/**
 * Holds the shared application state.
 */
export type State = {
  auth: AuthState;
};
