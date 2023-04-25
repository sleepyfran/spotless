import {
  Flex,
  Text,
  useBackendSpecificServices,
  useData,
} from "@spotless/components-shared";
import { PlayerCardProps, Player, PlayerCard } from "../Player";
import { INITIAL_PLAYER_STATE, PlayerData } from "@spotless/data-player";
import { bind } from "@react-rxjs/core";
import { Button } from "@mantine/core";
import { useState } from "react";

const [usePlayer$] = bind(
  (playerData: PlayerData) => playerData.state(),
  INITIAL_PLAYER_STATE
);

export const SpotifyPlayer = ({ className }: PlayerCardProps) => {
  const { player: playerData } = useData();
  const playerState = usePlayer$(playerData);

  return (
    <PlayerCard className={className}>
      {playerState.currentlyPlaying ? <Player /> : <DisconnectedPlayer />}
    </PlayerCard>
  );
};

type TransferPlaybackStatus = "disconnected" | "connecting" | "errored";

const DisconnectedPlayer = () => {
  const { player } = useBackendSpecificServices("spotify");
  const [status, setStatus] = useState<TransferPlaybackStatus>("disconnected");

  const onTransferPlaybackHereClick = () => {
    setStatus("connecting");
    player.transferPlayback(true).subscribe({
      complete: () => setStatus("disconnected"),
      error: () => setStatus("errored"),
    });
  };

  return (
    <Flex direction="column" align="center">
      <Text>Disconnected</Text>
      {status === "errored" && <Text color="red">Something went wrong</Text>}
      <Button
        variant="subtle"
        onClick={onTransferPlaybackHereClick}
        loading={status === "connecting"}
      >
        Transfer playback here
      </Button>
    </Flex>
  );
};
