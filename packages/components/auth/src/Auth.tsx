import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { Center, Stack, Button, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useColors, useServices } from "@spotless/components-shared";

export const AuthLayout = ({ children }: PropsWithChildren) => (
  <Center maw={400} mx="auto" h="100%">
    <Stack>{children}</Stack>
  </Center>
);

/**
 * Landing for the authentication, which allows the user to start the
 * authentication flow.
 */
export const AuthLanding = () => {
  const { authService } = useServices();

  const authorizeAccount = useCallback(() => {
    const authUrl = authService.getAuthenticationUrl();
    window.location.assign(authUrl);
  }, []);

  return (
    <AuthLayout>
      <Title order={3}>
        To use Spotless you first need to authenticate your Spotify account.
      </Title>
      <Button onClick={authorizeAccount}>Open Spotify login</Button>
    </AuthLayout>
  );
};

type AuthStatus = "not-requested" | "loading" | "errored";

/**
 * Landing after the user has been redirected back to the app from the auth
 * flow, which will process the auth callback and redirect to the home page
 * or show an error if the auth failed.
 */
export const ProcessAuthCallback = () => {
  const navigate = useNavigate();
  const { authService } = useServices();
  const colors = useColors();

  const [status, setStatus] = useState<AuthStatus>("not-requested");

  useEffect(() => {
    const authCallbackUrl = window.location.href;
    setStatus("loading");
    authService
      .authorizeFromCallback(authCallbackUrl)
      .then(() => navigate("/"))
      .catch(() => setStatus("errored"));
  }, []);

  return (
    <AuthLayout>
      {status === "errored" ? (
        <Title order={3} color={colors.error}>
          There was an error while logging you in. Please try again
        </Title>
      ) : (
        <Title order={3}>Working on it...</Title>
      )}
    </AuthLayout>
  );
};
