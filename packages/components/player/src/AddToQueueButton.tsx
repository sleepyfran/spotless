import { useServices } from "@spotless/components-shared";
import { Playable } from "@spotless/types";
import { MouseEventHandler, useState } from "react";
import { IconTextPlus, IconCircleCheckFilled } from "@tabler/icons-react";
import { ShapedButton, ShapedButtonProps } from "./common/ShapedButton";

type AddToQueueButtonProps = {
  /**
   * Item that this button is being shown on. When the button will be clicked,
   * this item will be passed onto the player.
   */
  item: Playable;
} & Pick<ShapedButtonProps, "style">;

type AddStatus = "idle" | "loading" | "success";

export const AddToQueueButton = ({ style, item }: AddToQueueButtonProps) => {
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
    <ShapedButton
      style={style}
      onClick={onClick}
      color="blue"
      loading={status === "loading"}
      text="Add to queue"
      icon={status === "success" ? <IconCircleCheckFilled /> : <IconTextPlus />}
    />
  );
};
