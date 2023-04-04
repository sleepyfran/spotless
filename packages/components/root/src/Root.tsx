import { AppShell } from "@mantine/core";
import { Header } from "@spotless/components-header";
import { PropsWithChildren } from "react";

export const Root = ({ children }: PropsWithChildren) => {
  return <AppShell header={<Header />}>{children}</AppShell>;
};
