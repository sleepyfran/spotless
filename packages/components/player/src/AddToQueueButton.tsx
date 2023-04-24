import { ActionIcon } from "@mantine/core";
import { useServices } from "@spotless/components-shared";
import { Playable } from "@spotless/types";
import { MouseEventHandler, useState } from "react";
import { IconTextPlus, IconCircleCheckFilled } from "@tabler/icons-react";

type AddToQueueButtonProps = {
  /**
   * Item that this button is being shown on. When the button will be clicked,
   * this item will be passed onto the player.
   */
  item: Playable;
};

type AddStatus = "idle" | "loading" | "success";

export const AddToQueueButton = ({ item }: AddToQueueButtonProps) => {
  const [status, setStatus] = useState<AddStatus>("idle");
  const { player } = useServices();

  const onClick: MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
    setStatus("loading");
    player.enqueue(item).subscribe({
      complete: () => setStatus("success"),
    });
  };

  return (
    <ActionIcon
      variant="filled"
      onClick={onClick}
      size="xl"
      radius="xl"
      color="blue"
      loading={status === "loading"}
      title="Add to queue"
    >
      {(status === "idle" || status === "loading") && <IconTextPlus />}
      {status === "success" && <IconCircleCheckFilled />}
    </ActionIcon>
  );
};
