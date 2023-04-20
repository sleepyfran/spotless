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

const DisconnectedPlayer = () => {
  const { player } = useBackendSpecificServices("spotify");

  const onTransferPlaybackHereClick = () => {
    player.transferPlayback(true).subscribe();
  };

  return (
    <Flex direction="column" align="center">
      <Text>Disconnected</Text>
      <Button variant="subtle" onClick={onTransferPlaybackHereClick}>
        Transfer playback here
      </Button>
    </Flex>
  );
};
