import { ActionIcon, Image, createStyles } from "@mantine/core";
import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

export type CoverArtPlayButtonProps = {
  /**
   * URL of the cover art to display.
   */
  coverArtUrl: string;

  /**
   * Defines what happens when the button is pressed.
   */
  onClick: () => void;

  /**
   * Whether the song is playing or not.
   */
  playing: boolean;
};

const useCoverArtStyles = createStyles((theme) => ({
  container: {
    position: "relative",

    ":hover:after": {
      content: '""',
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.gray[9]
          : theme.colors.gray[4],
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      height: "100%",
      opacity: 0.5,
    },
  },

  button: {
    position: "absolute",
    top: "23%",
    left: "23%",
    zIndex: 2,
  },
}));

export const CoverArtPlayButton = ({
  coverArtUrl,
  onClick,
  playing,
}: CoverArtPlayButtonProps) => {
  const styles = useCoverArtStyles();

  return (
    <motion.div layout="position" className={styles.classes.container}>
      <Image src={coverArtUrl} width={80} height={80} radius="sm" />

      <ActionIcon
        variant="transparent"
        size="xl"
        color="gray.0"
        className={styles.classes.button}
        onClick={onClick}
      >
        {playing ? <IconPlayerPauseFilled /> : <IconPlayerPlayFilled />}
      </ActionIcon>
    </motion.div>
  );
};
