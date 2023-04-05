import { AppShell, useMantineTheme } from "@mantine/core";
import { Header } from "@spotless/components-header";
import { PropsWithChildren } from "react";

export const Root = ({ children }: PropsWithChildren) => {
  const theme = useMantineTheme();

  return (
    <AppShell header={<Header />} px={theme.spacing.xl}>
      {children}
    </AppShell>
  );
};
