import { Card, Text, Flex, Button } from "@mantine/core";
import { bind } from "@react-rxjs/core";
import { useData, useServices } from "@spotless/components-shared";
import { INITIAL_PLAYER_STATE, PlayerData } from "@spotless/data-player";
import { CoverArtPlayButton } from "./CoverArtPlayButton";
import { useCallback } from "react";
import { CurrentlyPlaying } from "@spotless/types";

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

  return (
    <Card shadow="xl" withBorder className={className}>
      {playerState.currentlyPlaying ? (
        <ConnectedPlayer
          currentlyPlaying={playerState.currentlyPlaying}
          playing={!playerState.paused}
          onCoverArtClick={onCoverArtClick}
        />
      ) : (
        <DisconnectedPlayer />
      )}
    </Card>
  );
};

type ConnectedPlayerProps = {
  currentlyPlaying: CurrentlyPlaying;
  playing: boolean;
  onCoverArtClick: () => void;
};

const ConnectedPlayer = ({
  currentlyPlaying,
  playing,
  onCoverArtClick,
}: ConnectedPlayerProps) => {
  return (
    <Flex gap={10}>
      <CoverArtPlayButton
        coverArtUrl={currentlyPlaying.coverUrl}
        playing={playing}
        onClick={onCoverArtClick}
      />
      <Flex direction="column">
        <Text fz="lg" variant="gradient" fw="bold">
          {currentlyPlaying.trackName}
        </Text>
        <Text fz="sm">{currentlyPlaying.artistName}</Text>
      </Flex>
    </Flex>
  );
};

const DisconnectedPlayer = () => {
  const { player } = useServices();

  const onTransferPlaybackHereClick = useCallback(() => {
    player.transferPlayback().subscribe();
  }, [player]);

  return (
    <Flex direction="column" align="center">
      <Text>Disconnected</Text>
      <Button variant="subtle" onClick={onTransferPlaybackHereClick}>
        Transfer playback here
      </Button>
    </Flex>
  );
};
