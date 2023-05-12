import { Menu, Button } from "@mantine/core";
import {
  IconSortDescending2,
  IconSortAscending2,
  IconPlayerPlayFilled,
  IconCircleCheckFilled,
  IconArrowsShuffle,
} from "@tabler/icons-react";
import { Artist } from "@spotless/types";
import { useServices } from "@spotless/components-shared";
import { PlayArtistDiscographyMode } from "@spotless/services-player";
import { useState } from "react";

type PlayArtistProps = {
  /**
   * Artist to play.
   */
  artist: Artist;
};

type Status = "idle" | "loading" | "success";

/**
 * Component that displays a button with the options to play an artist's
 * discography.
 */
export const PlayArtist = ({ artist }: PlayArtistProps) => {
  const [status, setStatus] = useState<Status>("idle");
  const { player } = useServices();

  const onModeSelected = (mode: PlayArtistDiscographyMode) => {
    setStatus("loading");
    player.playArtistDiscography(artist, mode).subscribe({
      complete: () => setStatus("success"),
    });
  };

  return (
    <Menu trigger="hover" openDelay={100} closeDelay={400}>
      <Menu.Target>
        <Button
          loading={status === "loading"}
          leftIcon={
            status === "success" ? (
              <IconCircleCheckFilled />
            ) : (
              <IconPlayerPlayFilled />
            )
          }
        >
          Play all...
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          icon={<IconSortDescending2 />}
          onClick={() => onModeSelected(PlayArtistDiscographyMode.FromNewest)}
        >
          From newest to oldest
        </Menu.Item>
        <Menu.Item
          icon={<IconSortAscending2 />}
          onClick={() => onModeSelected(PlayArtistDiscographyMode.FromOldest)}
        >
          From oldest to newest
        </Menu.Item>
        <Menu.Item
          icon={<IconArrowsShuffle />}
          onClick={() => onModeSelected(PlayArtistDiscographyMode.Shuffled)}
        >
          Shuffled
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
