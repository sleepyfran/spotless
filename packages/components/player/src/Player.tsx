import { Card, ScrollArea, createStyles } from "@mantine/core";
import { bind } from "@react-rxjs/core";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  Flex,
  Text,
  Title,
  useData,
  useServices,
} from "@spotless/components-shared";
import { INITIAL_PLAYER_STATE, PlayerData } from "@spotless/data-player";
import { CoverArtPlayButton } from "./CoverArtPlayButton";
import { QueueItem } from "@spotless/types";
import { QueueButton } from "./QueueButton";
import { ShuffleButton } from "./ShuffleButton";
import { QueuedTrackItem } from "./QueueItem";
import { PropsWithChildren, useState } from "react";
import { VolumePopoverButton } from "./VolumeControls";

const usePlayerStyles = createStyles({
  root: {
    minWidth: 250,
  },
});

const [usePlayer$] = bind(
  (playerData: PlayerData) => playerData.state(),
  INITIAL_PLAYER_STATE
);

export type PlayerCardProps = {
  className?: string;
};

export const PlayerCard = ({
  className,
  children,
}: PropsWithChildren<PlayerCardProps>) => {
  const playerStyles = usePlayerStyles();

  return (
    <LayoutGroup>
      <Card
        shadow="xl"
        withBorder
        className={playerStyles.cx(playerStyles.classes.root, className)}
        component={motion.div}
        layout
      >
        {children}
      </Card>
    </LayoutGroup>
  );
};

/**
 * Component that contains the main player UI, which shows the currently playing
 * track and allows the user to control playback.
 */
export const Player = () => {
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
    <ConnectedPlayer
      currentlyPlaying={playerState.currentlyPlaying}
      queue={playerState.queue}
      currentVolume={playerState.volume}
      shuffling={playerState.shuffle}
      playing={!playerState.paused}
      onCoverArtClick={onCoverArtClick}
    />
  );
};

type ConnectedPlayerProps = {
  currentlyPlaying: QueueItem | undefined;
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
    <motion.div layout>
      <AnimatePresence mode="popLayout">
        {queueVisible && (
          <motion.div key="queue" exit={{ y: [null, 20] }}>
            <Text fz="lg" my="sm">
              Queue
            </Text>
            <ScrollArea h={300}>
              {queue.map((item, index) => (
                <QueuedTrackItem key={index} item={item} />
              ))}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <Flex gap={10} align="center">
        <CoverArtPlayButton
          coverArtUrl={currentlyPlaying?.coverUrl}
          playing={playing}
          onClick={onCoverArtClick}
        />
        <Flex direction="column">
          <Flex gap={5} align="center">
            <Title title={currentlyPlaying?.trackName || ""}></Title>
            <Text fz="sm" fw="lighter">
              {currentlyPlaying?.artistName || ""}
            </Text>
          </Flex>
          <Flex component={motion.div} layout="position">
            <ShuffleButton shuffling={shuffling} />
            <QueueButton onClick={onQueueClick} enabled={queue.length > 0} />
            <VolumePopoverButton currentVolume={currentVolume} />
          </Flex>
        </Flex>
      </Flex>
    </motion.div>
  );
};
