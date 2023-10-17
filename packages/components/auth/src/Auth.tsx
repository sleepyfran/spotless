import { PropsWithChildren, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paths } from "@spotless/components-shared";

const AuthLayout = ({ children }: PropsWithChildren) => (
  <div className="hero-container">
    <div className="hero-children">{children}</div>
  </div>
);

type AuthStatus = "not-requested" | "loading" | "finished" | "errored";

type AuthorizeButtonProps = {
  onAuthorize: () => void;
};

const AuthorizeButton = ({ onAuthorize }: AuthorizeButtonProps) => (
  <button onClick={onAuthorize}>Open Spotify login</button>
);

/**
 * Landing for the authentication, which allows the user to start the
 * authentication flow and handles what happens after the auth finishes.
 */
export const AuthLanding = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("not-requested");
  const navigate = useNavigate();

  const authorizeAccount = () => {
    setAuthStatus("loading");
    // authService
    //   .authorize()
    //   .then(() => setAuthStatus("finished"))
    //   .catch(() => setAuthStatus("errored"));
  };

  useEffect(() => {
    if (authStatus === "finished") {
      navigate(Paths.root);
    }
  }, [navigate, authStatus]);

  return (
    <AuthLayout>
      {authStatus === "not-requested" ? (
        <>
          <h3>
            To use Spotless you first need to authenticate your Spotify account.
          </h3>
          <AuthorizeButton onAuthorize={authorizeAccount} />
        </>
      ) : authStatus === "loading" ? (
        <h1>Loading...</h1>
      ) : authStatus === "errored" ? (
        <>
          <h3 className="error">
            There was an error while logging you in. Please try again
          </h3>
          <AuthorizeButton onAuthorize={authorizeAccount} />
        </>
      ) : null}
    </AuthLayout>
  );
};

/**
 * Dummy landing for the callback page after the user has authenticated. This
 * page is only used to show a loading indicator while the auth service
 * finishes the authentication flow.
 */
export const AuthCallback = () => (
  <AuthLayout>
    <h1>Loading...</h1>
  </AuthLayout>
);
