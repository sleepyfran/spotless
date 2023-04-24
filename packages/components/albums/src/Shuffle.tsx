import { Button } from "@mantine/core";
import { useServices } from "@spotless/components-shared";
import { Album } from "@spotless/types";
import { IconArrowsShuffle } from "@tabler/icons-react";
import { useState } from "react";

type ShuffleProps = {
  items: Album[];
};

type Status = "idle" | "loading" | "success";

/**
 * Component that displays a shuffle button that, when pressed, shuffles all
 * the given items.
 */
export const Shuffle = ({ items }: ShuffleProps) => {
  const [status, setStatus] = useState<Status>("idle");
  const { player } = useServices();

  const onClick = () => {
    setStatus("loading");
    player.shuffleAlbums(items).subscribe({
      complete: () => setStatus("success"),
    });
  };

  return (
    <Button
      leftIcon={<IconArrowsShuffle />}
      loading={status === "loading"}
      title="This will play each album in order and completely but shuffle the order in which they are played"
      disabled={items.length < 2}
      onClick={onClick}
    >
      Shuffle all
    </Button>
  );
};
