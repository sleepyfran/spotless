import { Playable } from "@spotless/types";
import { useServices } from "@spotless/components-shared/src/ServiceContext";
import { MouseEventHandler } from "react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { ShapedButtonProps, ShapedButton } from "./common/ShapedButton";

type PlayButtonProps = {
  /**
   * Item that this button is being shown on. When the button will be clicked,
   * this item will be passed onto the player.
   */
  item: Playable;
} & Pick<ShapedButtonProps, "style">;

/**
 * Component that displays a play button that plays the given playable item
 * when clicked.
 */
export const PlayButton = ({ item, style }: PlayButtonProps) => {
  const { player } = useServices();

  const onClick: MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
    player.play(item).subscribe();
  };

  return (
    <ShapedButton
      style={style}
      onClick={onClick}
      text="Play"
      icon={<IconPlayerPlayFilled />}
    />
  );
};
