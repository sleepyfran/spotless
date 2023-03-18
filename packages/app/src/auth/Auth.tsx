import { useCallback, useEffect, useState } from "react";
import { useServices } from "../service-context";
import { useNavigate } from "react-router-dom";

export const AuthLanding = () => {
  const { authService } = useServices();

  const authorizeAccount = useCallback(() => {
    const authUrl = authService.getAuthenticationUrl();
    window.location.assign(authUrl);
  }, []);

  return (
    <div className="App">
      <div className="card">
        <button onClick={authorizeAccount}>
          Login to your Spotify account
        </button>
      </div>
    </div>
  );
};

type AuthStatus = "not-requested" | "loading" | "errored";

export const ProcessAuthCallback = () => {
  const { authService } = useServices();
  const navigate = useNavigate();

  const [status, setStatus] = useState<AuthStatus>("not-requested");

  useEffect(() => {
    const authCallbackUrl = window.location.href;
    setStatus("loading");
    authService
      .authorizeFromCallback(authCallbackUrl)
      .then(() => navigate("/"))
      .catch(() => setStatus("errored"));
  }, []);

  return status === "errored" ? (
    <p>There was an error while logging you in. Please try again</p>
  ) : (
    <p>Working on it...</p>
  );
};
