import { ActionIcon } from "@mantine/core";
import { IconList } from "@tabler/icons-react";

type QueueButtonProps = {
  /**
   * Callback to be called when the button is clicked.
   */
  onClick: () => void;

  /**
   * Indicates whether the queue is currently visible or not.
   */
  queueVisible?: boolean;
};

/**
 * Component that renders a button to toggle the queue.
 */
export const QueueButton = ({ onClick, queueVisible }: QueueButtonProps) => (
  <ActionIcon
    variant="light"
    size="sm"
    onClick={onClick}
    color={queueVisible ? "blue" : undefined}
    title="Toggle queue"
  >
    <IconList />
  </ActionIcon>
);
