import { Button, ActionIcon } from "@mantine/core";
import { Playable } from "@spotless/types";
import { IconPlayerPlay } from "@tabler/icons-react";
import { useServices } from "@spotless/components-shared/src/ServiceContext";
import { MouseEventHandler } from "react";

type PlayButtonProps = {
  /**
   * Extra class names to be passed onto the action icon.
   */
  className?: string;

  /**
   * Defines the style of the button. If not specified, defaults to "regular".
   */
  style?: "rounded" | "regular";

  /**
   * Item that this button is being shown on. When the button will be clicked,
   * this item will be passed onto the player.
   */
  item: Playable;
};

const usePlayOnClick = (item: Playable): MouseEventHandler<HTMLElement> => {
  const { player } = useServices();

  return (event) => {
    event.stopPropagation();
    player.play(item).subscribe();
  };
};

/**
 * Component that displays a play button that plays the given playable item
 * when clicked.
 */
export const PlayButton = ({ item, style, className }: PlayButtonProps) => {
  return style === "rounded" ? (
    <RoundedPlayButton item={item} className={className} />
  ) : (
    <RegularPlayButton item={item} className={className} />
  );
};

const RegularPlayButton = ({ item, className }: PlayButtonProps) => {
  const onClick = usePlayOnClick(item);

  return (
    <Button
      variant="light"
      className={className}
      onClick={onClick}
      color="green"
      leftIcon={<IconPlayerPlay />}
    >
      Play
    </Button>
  );
};

const RoundedPlayButton = ({ item, className }: PlayButtonProps) => {
  const onClick = usePlayOnClick(item);

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
