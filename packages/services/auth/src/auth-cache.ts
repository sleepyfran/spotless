import { AuthUser, AuthenticatedUser } from "@spotless/types";
import { checkTokenValidity } from "./auth-common";

export type AuthCache = {
  item: AuthUser;
  needsRefresh: boolean;
};

/**
 * Attempts to retrieve the auth state from the local storage, checking for the
 * validity of the cached token.
 */
export const retrieveFromCache = (): AuthCache | undefined => {
  const item = localStorage.getItem("auth");
  if (item) {
    const authState = JSON.parse(item);
    return {
      item: authState,
      needsRefresh: checkTokenValidity(authState),
    };
  }

  return undefined;
};

/**
 * Saves the given auth information in the local storage so that it can be
 * retrieved later on during the app initialization.
 */
export const saveToCache = (auth: AuthenticatedUser) => {
  localStorage.setItem("auth", JSON.stringify(auth));
};
