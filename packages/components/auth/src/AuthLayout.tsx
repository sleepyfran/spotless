import { PropsWithChildren } from "react";

export const AuthLayout = ({ children }: PropsWithChildren) => (
  <div className="hero-container">
    <div className="hero-children">{children}</div>
  </div>
);
