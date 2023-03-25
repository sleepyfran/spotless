import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { Button, makeStyles, Title3 } from "@fluentui/react-components";
import { useServices } from "@spotless/component-services-context";
import { useNavigate } from "react-router-dom";
import { Flex, useErrorStyles } from "@spotless/component-shared";

const useStyles = makeStyles({
  root: {
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    height: "100vh",
  },
  content: {
    maxWidth: "25rem",
  },
});

const AuthLayout = ({ children }: PropsWithChildren) => {
  const styles = useStyles();

  return (
    <main className={styles.root}>
      <Flex gap="gap.medium" column className={styles.content}>
        {children}
      </Flex>
    </main>
  );
};

export const AuthLanding = () => {
  const { authService } = useServices();

  const authorizeAccount = useCallback(() => {
    const authUrl = authService.getAuthenticationUrl();
    window.location.assign(authUrl);
  }, []);

  return (
    <AuthLayout>
      <Title3>
        To use Spotless you first need to authenticate your Spotify account.
      </Title3>
      <Button onClick={authorizeAccount}>Open Spotify login</Button>
    </AuthLayout>
  );
};

type AuthStatus = "not-requested" | "loading" | "errored";

export const ProcessAuthCallback = () => {
  const { authService } = useServices();
  const navigate = useNavigate();
  const errorStyles = useErrorStyles();

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
        <Title3 className={errorStyles.text}>
          There was an error while logging you in. Please try again
        </Title3>
      ) : (
        <Title3>Working on it...</Title3>
      )}
    </AuthLayout>
  );
};
