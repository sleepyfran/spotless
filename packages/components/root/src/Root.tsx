import {
  AppShell,
  Flex,
  Modal,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import { AlbumDetails } from "@spotless/components-albums";
import { Header } from "@spotless/components-header";
import { SpotifyPlayer } from "@spotless/components-player";
import { modals } from "@spotless/components-shared";
import { bind } from "@react-rxjs/core";
import { PropsWithChildren } from "react";

const usePlayerStyles = createStyles({
  player: {
    position: "fixed",
    bottom: "5%",
    zIndex: 999,
  },
});

const [modals$, setModal] = modals;
const [useCurrentModal] = bind(modals$, { __type: "hidden" });

export const Root = ({ children }: PropsWithChildren) => {
  const theme = useMantineTheme();
  const styles = usePlayerStyles();

  const modal = useCurrentModal();
  const onCloseModal = () => setModal({ __type: "hidden" });

  return (
    <AppShell header={<Header />} px={theme.spacing.xl}>
      <Modal
        opened={modal.__type !== "hidden"}
        onClose={onCloseModal}
        size="50%"
        transitionProps={{
          transition: "pop",
          duration: 150,
        }}
      >
        {modal.__type === "album" ? (
          <AlbumDetails albumId={modal.albumId} />
        ) : null}
      </Modal>

      <SpotifyPlayer className={styles.classes.player} />
      {/* Leave enough space for the player to scroll off. */}
      <Flex pb="15rem">{children}</Flex>
    </AppShell>
  );
};
