import { Card, Text, Flex, Button, ScrollArea } from "@mantine/core";
import { bind } from "@react-rxjs/core";
import { Title, useData, useServices } from "@spotless/components-shared";
import { INITIAL_PLAYER_STATE, PlayerData } from "@spotless/data-player";
import { CoverArtPlayButton } from "./CoverArtPlayButton";
import { QueueItem } from "@spotless/types";
import { QueueButton } from "./QueueButton";
import { ShuffleButton } from "./ShuffleButton";
import { QueuedTrackItem } from "./QueueItem";
import { useState } from "react";
import { VolumePopoverButton } from "./VolumeControls";

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

  const onCoverArtClick = () => {
    if (playerState.paused) {
      playerService.resume().subscribe();
    } else {
      playerService.pause().subscribe();
    }
  };

  return (
    <Card shadow="xl" withBorder className={className}>
      {playerState.currentlyPlaying ? (
        <ConnectedPlayer
          currentlyPlaying={playerState.currentlyPlaying}
          queue={playerState.queue}
          currentVolume={playerState.volume}
          shuffling={playerState.shuffle}
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
  currentlyPlaying: QueueItem;
  queue: QueueItem[];
  currentVolume: number;
  shuffling: boolean;
  playing: boolean;
  onCoverArtClick: () => void;
};

const ConnectedPlayer = ({
  currentlyPlaying,
  queue,
  currentVolume,
  shuffling,
  playing,
  onCoverArtClick,
}: ConnectedPlayerProps) => {
  const [queueVisible, setQueueVisible] = useState(false);

  const onQueueClick = () => setQueueVisible((visible) => !visible);

  return (
    <Flex direction="column">
      <Flex gap={10} align="center">
        <CoverArtPlayButton
          coverArtUrl={currentlyPlaying.coverUrl}
          playing={playing}
          onClick={onCoverArtClick}
        />
        <Flex direction="column">
          <Flex gap={5} align="center">
            <Title title={currentlyPlaying.trackName}></Title>
            <Text fz="sm" fw="lighter">
              {currentlyPlaying.artistName}
            </Text>
          </Flex>
          <Flex gap={5} align="center">
            <ShuffleButton shuffling={shuffling} />
            <QueueButton onClick={onQueueClick} enabled={queue.length > 0} />
            <VolumePopoverButton currentVolume={currentVolume} />
          </Flex>
        </Flex>
      </Flex>

      {queueVisible && (
        <>
          <Text fz="lg" my="sm">
            Queue
          </Text>
          <ScrollArea h={300}>
            {queue.map((item, index) => (
              <QueuedTrackItem key={index} item={item} />
            ))}
          </ScrollArea>
        </>
      )}
    </Flex>
  );
};

const DisconnectedPlayer = () => {
  const { player } = useServices();

  const onTransferPlaybackHereClick = () => {
    player.transferPlayback().subscribe();
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
