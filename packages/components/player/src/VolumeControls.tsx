import { ActionIcon, Popover, Slider } from "@mantine/core";
import { useServices } from "@spotless/components-shared";
import { IconVolume } from "@tabler/icons-react";
import { useState } from "react";

type VolumePopoverButtonProps = {
  currentVolume: number;
};

/**
 * Component that renders a button that, when clicked, renders a popover with
 * a volume control.
 */
export const VolumePopoverButton = ({
  currentVolume,
}: VolumePopoverButtonProps) => {
  const { player } = useServices();
  const [volume, setVolume] = useState(currentVolume);

  const onVolumeChange = (value: number) => {
    player.setVolume(value).subscribe({
      complete: () => setVolume(value),
    });
  };

  return (
    <Popover width={200}>
      <Popover.Target>
        <ActionIcon variant="light" size="sm" title="Toggle volume controls">
          <IconVolume />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <Slider value={volume} onChange={onVolumeChange} />
      </Popover.Dropdown>
    </Popover>
  );
};
