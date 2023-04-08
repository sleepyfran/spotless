import { AuthenticatedUser } from "@spotless/types";

/**
 * Checks if the validity of the token expires in the next 3 minutes.
 */
export const isValidToken = (authState: AuthenticatedUser): boolean => {
  const refreshThresholdInMs = 1000 * 60 * 3; // 3 minutes.
  return Date.now() <= authState.expirationTimestamp - refreshThresholdInMs;
};
