import { ActionIcon } from "@mantine/core";
import { IconList } from "@tabler/icons-react";

type QueueButtonProps = {
  /**
   * Callback to be called when the button is clicked.
   */
  onClick: () => void;

  /**
   * Indicates whether the button is currently enabled or not.
   */
  enabled?: boolean;
};

export const QueueButton = ({ onClick, enabled }: QueueButtonProps) => (
  <ActionIcon
    variant="light"
    size="sm"
    onClick={onClick}
    title="Toggle queue"
    disabled={!enabled}
  >
    <IconList />
  </ActionIcon>
);
