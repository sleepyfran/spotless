import { Card, Text, Flex } from "@mantine/core";
import { bind } from "@react-rxjs/core";
import { useData, useServices } from "@spotless/components-shared";
import { INITIAL_PLAYER_STATE, PlayerData } from "@spotless/data-player";
import { CoverArtPlayButton } from "./CoverArtPlayButton";
import { useCallback } from "react";

const [usePlayer$] = bind(
  (playerData: PlayerData) => playerData.state(),
  INITIAL_PLAYER_STATE
);

type PlayerProps = {
  className?: string;
};

/**
 * Component that contains the main player UI, which shows the currently playing
 * track and allows the user to control playback.
 */
export const Player = ({ className }: PlayerProps) => {
  const { player: playerService } = useServices();
  const { player } = useData();
  const playerState = usePlayer$(player);

  const onCoverArtClick = useCallback(() => {
    if (playerState.paused) {
      playerService.resume().subscribe();
    } else {
      playerService.pause().subscribe();
    }
  }, [playerService, playerState]);

  return playerState.currentlyPlaying ? (
    <Card shadow="xl" withBorder className={className}>
      <Flex gap={10} align="center">
        <CoverArtPlayButton
          coverArtUrl={playerState.currentlyPlaying.coverUrl}
          playing={!playerState.paused}
          onClick={onCoverArtClick}
        />
        <Flex direction="column">
          <Text fz="lg" variant="gradient" fw="bold">
            {playerState.currentlyPlaying.trackName}
          </Text>
          <Text fz="sm">{playerState.currentlyPlaying.artistName}</Text>
        </Flex>
      </Flex>
    </Card>
  ) : null;
};
