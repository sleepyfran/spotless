import { AppShell, Flex, createStyles, useMantineTheme } from "@mantine/core";
import { Header } from "@spotless/components-header";
import { Player } from "@spotless/components-player";
import { PropsWithChildren } from "react";

const usePlayerStyles = createStyles({
  player: {
    position: "fixed",
    bottom: "5%",
    zIndex: 999,
  },
});

export const Root = ({ children }: PropsWithChildren) => {
  const theme = useMantineTheme();
  const styles = usePlayerStyles();

  return (
    <AppShell header={<Header />} px={theme.spacing.xl}>
      <Player className={styles.classes.player} />
      {/* Leave enough space for the player to scroll off. */}
      <Flex pb="15rem">{children}</Flex>
    </AppShell>
  );
};
