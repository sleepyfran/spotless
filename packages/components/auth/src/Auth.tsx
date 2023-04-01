import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { Center, Stack, Button, Title } from "@mantine/core";
import { useServices } from "@spotless/component-core-context";
import { useNavigate } from "react-router-dom";
import { useErrorColor } from "@spotless/component-shared";

const AuthLayout = ({ children }: PropsWithChildren) => (
  <Center maw={400} mx="auto" h="100%">
    <Stack>{children}</Stack>
  </Center>
);

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

export const ProcessAuthCallback = () => {
  const { authService } = useServices();
  const navigate = useNavigate();
  const errorColor = useErrorColor();

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
        <Title order={3} color={errorColor}>
          There was an error while logging you in. Please try again
        </Title>
      ) : (
        <Title order={3}>Working on it...</Title>
      )}
    </AuthLayout>
  );
};
