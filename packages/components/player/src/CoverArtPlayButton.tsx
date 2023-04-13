import { ActionIcon, Image, createStyles } from "@mantine/core";
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";

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
      backgroundColor: theme.colors.gray[9],
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
    <div className={styles.classes.container}>
      <Image src={coverArtUrl} width={80} height={80} radius="sm" />

      <ActionIcon
        variant="transparent"
        size="xl"
        className={styles.classes.button}
        onClick={onClick}
      >
        {playing ? <IconPlayerPause /> : <IconPlayerPlay />}
      </ActionIcon>
    </div>
  );
};