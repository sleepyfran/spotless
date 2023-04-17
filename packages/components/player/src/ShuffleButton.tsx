import { ActionIcon } from "@mantine/core";
import { IconArrowsShuffle } from "@tabler/icons-react";

type ShuffleButtonProps = {
  /**
   * Indicates whether the shuffle is currently enabled or not.
   */
  shuffling: boolean;
};

/**
 * Component that renders a button to toggle the shuffle.
 */
export const ShuffleButton = ({ shuffling }: ShuffleButtonProps) => {
  const onClick = () => console.log("Shuffle clicked");

  return (
    <ActionIcon
      variant="light"
      size="sm"
      color={shuffling ? "green" : undefined}
      onClick={onClick}
      title="Toggle shuffle"
    >
      <IconArrowsShuffle />
    </ActionIcon>
  );
};
