import {
  AppShell,
  Flex,
  Modal,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import { AlbumDetail } from "@spotless/components-albums";
import { Header } from "@spotless/components-header";
import { Player } from "@spotless/components-player";
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
const [useCurrentModal] = bind(modals$, undefined);

export const Root = ({ children }: PropsWithChildren) => {
  const theme = useMantineTheme();
  const styles = usePlayerStyles();

  const modal = useCurrentModal();
  const onCloseModal = () => setModal(undefined);

  return (
    <AppShell header={<Header />} px={theme.spacing.xl}>
      {modal && (
        <Modal opened={!!modal} onClose={onCloseModal} size="50%">
          {modal.__type === "Album" ? (
            <AlbumDetail albumId={modal.albumId} />
          ) : null}
        </Modal>
      )}

      <Player className={styles.classes.player} />
      {/* Leave enough space for the player to scroll off. */}
      <Flex pb="15rem">{children}</Flex>
    </AppShell>
  );
};
