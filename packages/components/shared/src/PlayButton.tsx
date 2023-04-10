import { ActionIcon } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";

type PlayButtonProps = {
  className?: string;
  onClick: () => void;
};

/**
 * Component that displays a play button and performs a given action when clicked.
 */
export const PlayButton = ({ onClick, className }: PlayButtonProps) => {
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
