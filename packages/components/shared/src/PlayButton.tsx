import { ActionIcon } from "@mantine/core";
import { Album } from "@spotless/types";
import { IconPlayerPlay } from "@tabler/icons-react";
import { useServices } from "./ServiceContext";
import { useCallback } from "react";

type PlayButtonProps = {
  /**
   * Extra class names to be passed onto the action icon.
   */
  className?: string;

  /**
   * Item that this button is being shown on. When the button will be clicked,
   * this item will be passed onto the player.
   */
  item: Album;
};

/**
 * Component that displays a play button and performs a given action when clicked.
 */
export const PlayButton = ({ item, className }: PlayButtonProps) => {
  const { player } = useServices();

  const onClick = useCallback(() => {
    player.play(item).subscribe();
  }, [player]);

  return (
    <ActionIcon
      variant="filled"
      className={className}
      onClick={onClick}
      size="xl"
      radius="xl"
      color="green"
    >
      <IconPlayerPlay />
    </ActionIcon>
  );
};
