import { useCallback, useState } from "react";
import { Button } from "@fluentui/react-components";
import { useServices } from "@spotless/component-core-context";
import { WithScript } from "@spotless/component-shared";

const PlayerInner = () => {
  const [playing, setPlaying] = useState(false);
  const { playerService } = useServices();

  const togglePlay = useCallback(() => {
    if (playing) {
      playerService.pause();
    } else {
      playerService.resume();
    }
    setPlaying(!playing);
  }, [playing, setPlaying, playerService]);

  return <Button onClick={togglePlay}>Play/pause</Button>;
};

export const Player = () => (
  <WithScript src="https://sdk.scdn.co/spotify-player.js">
    <PlayerInner />
  </WithScript>
);
