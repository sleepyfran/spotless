import { PropsWithChildren, useEffect, useState } from "react";

type ScriptLoaderProps = {
  src: string;
};

export const WithScript = ({
  src,
  children,
}: PropsWithChildren<ScriptLoaderProps>) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => setReady(true);
    script.onerror = () => {
      throw new Error(`Failed to load script: ${src}`);
    };
    document.body.appendChild(script);
  }, []);

  return ready ? <>{children}</> : null;
};
