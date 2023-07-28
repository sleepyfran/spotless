import { ActionIcon } from "@mantine/core";
import { IconPlayerSkipForward } from "@tabler/icons-react";

type SkipButtonProps = {
  /**
   * Callback to be called when the button is clicked.
   */
  onClick: () => void;
};

/**
 * Component that renders a button to skip the current track.
 */
export const SkipButton = ({ onClick }: SkipButtonProps) => (
  <ActionIcon
    variant="light"
    size="sm"
    onClick={onClick}
    title="Skip current track"
  >
    <IconPlayerSkipForward />
  </ActionIcon>
);
