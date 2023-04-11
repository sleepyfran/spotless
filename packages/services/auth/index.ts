import { AuthenticatedUser } from "@spotless/types";

/**
 * Checks if the validity of the token expires in the next 3 minutes.
 */
export const isValidToken = (authState: AuthenticatedUser): boolean => {
  const refreshThresholdInMs = 1000 * 60 * 3; // 3 minutes.
  return Date.now() <= authState.expirationTimestamp - refreshThresholdInMs;
};

/**
 * Wrapper around the concrete authorization logic that each provider implements.
 */
export interface AuthService {
  /**
   * Performs the OAuth authorization flow of a specific provider. The promise
   * resolves once the service is done with the flow and has saved the credentials
   * to the database or whatever method of caching it implements.
   */
  authorize(): Promise<void>;

  /**
   * Removes all user login credentials from the app.
   */
  unauthorize(): Promise<void>;
}
