import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { Center, Stack, Button, Title, Loader } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useColors, useServices, Paths } from "@spotless/components-shared";

export const AuthLayout = ({ children }: PropsWithChildren) => (
  <Center maw={400} mx="auto" h="100%">
    <Stack>{children}</Stack>
  </Center>
);

type AuthStatus = "not-requested" | "loading" | "finished" | "errored";

type AuthorizeButtonProps = {
  onAuthorize: () => void;
};

const AuthorizeButton = ({ onAuthorize }: AuthorizeButtonProps) => (
  <Button onClick={onAuthorize}>Open Spotify login</Button>
);

/**
 * Landing for the authentication, which allows the user to start the
 * authentication flow and handles what happens after the auth finishes.
 */
export const AuthLanding = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("not-requested");
  const { authService } = useServices();
  const colors = useColors();
  const navigate = useNavigate();

  const authorizeAccount = useCallback(() => {
    setAuthStatus("loading");
    authService
      .authorize()
      .then(() => setAuthStatus("finished"))
      .catch(() => setAuthStatus("errored"));
  }, []);

  useEffect(() => {
    if (authStatus === "finished") {
      navigate(Paths.root);
    }
  }, [navigate, authStatus]);

  return (
    <AuthLayout>
      {authStatus === "not-requested" ? (
        <>
          <Title order={3}>
            To use Spotless you first need to authenticate your Spotify account.
          </Title>
          <AuthorizeButton onAuthorize={authorizeAccount} />
        </>
      ) : authStatus === "loading" ? (
        <Loader />
      ) : authStatus === "errored" ? (
        <>
          <Title order={3} color={colors.error}>
            There was an error while logging you in. Please try again
          </Title>
          <AuthorizeButton onAuthorize={authorizeAccount} />
        </>
      ) : null}
    </AuthLayout>
  );
};
