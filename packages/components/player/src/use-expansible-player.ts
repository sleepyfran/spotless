import { useHover } from "@mantine/hooks";
import { useEffect, useState } from "react";

const COLLAPSE_DELAY = 1000;

/**
 * Exposes a ref to be attached to the player and a boolean value that indicates
 * whether the player is expanded or not. When the player loses focus, schedules
 * a collapse after a delay.
 */
export const useExpansiblePlayer = () => {
  const { ref, hovered } = useHover();
  const [expanded, setExpanded] = useState(true);

  const scheduleCollapse = () => {
    const timeout = setTimeout(() => {
      if (!hovered) {
        setExpanded(false);
      }
    }, COLLAPSE_DELAY);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    if (!hovered) {
      return scheduleCollapse();
    } else {
      setExpanded(true);
    }
  }, [hovered]);

  return [expanded, ref] as const;
};
