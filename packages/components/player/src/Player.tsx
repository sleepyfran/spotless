import { Button, Card, ScrollArea } from "@mantine/core";
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
import { QueueButton } from "./QueueButton";
import { QueuedAlbumItem } from "./Queue";
import { PropsWithChildren, useState } from "react";
import { VolumePopoverButton } from "./VolumeControls";
import { useExpansiblePlayer } from "./use-expansible-player";

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
}: PropsWithChildren<PlayerCardProps>) => (
  <LayoutGroup>
    <Card
      shadow="xl"
      withBorder
      className={className}
      component={motion.div}
      layout
    >
      {children}
    </Card>
  </LayoutGroup>
);

/**
 * Component that contains the main player UI, which shows the currently playing
 * track and allows the user to control playback.
 */
export const Player = () => {
  const [expanded, ref] = useExpansiblePlayer();
  const [queueVisible, setQueueVisible] = useState(false);

  const { player: playerService } = useServices();
  const { player } = useData();
  const playerState = usePlayer$(player);

  const onQueueClick = () => setQueueVisible((visible) => !visible);
  const onClearQueueClick = () => playerService.clearQueue().subscribe();

  return (
    <motion.div layout ref={ref}>
      <AnimatePresence>
        {queueVisible && expanded && (
          <motion.div key="queue">
            <Flex align="center" gap="sm">
              <Text fz="lg" my="sm">
                Queue
              </Text>
              <Button variant="light" size="xs" onClick={onClearQueueClick}>
                Clear
              </Button>
            </Flex>
            <ScrollArea h={300}>
              {playerState.queue.map((album) => (
                <QueuedAlbumItem
                  key={album.id}
                  album={album}
                  trackListExpandedByDefault={
                    album.id === playerState.currentlyPlaying?.album.id
                  }
                />
              ))}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <Flex gap={10} align="center">
        <CoverArtPlayButton
          coverArtUrl={playerState.currentlyPlaying?.album.coverUrl}
          playing={!playerState.paused}
        />

        <AnimatePresence>
          {expanded && (
            <Flex direction="column">
              <Flex gap={5} align="center">
                <Title title={playerState.currentlyPlaying?.name || ""}></Title>
                <Text fz="sm" fw="lighter">
                  {playerState.currentlyPlaying?.album.artistName || ""}
                </Text>
              </Flex>
              <Flex component={motion.div} layout="position">
                <QueueButton
                  onClick={onQueueClick}
                  queueVisible={queueVisible}
                />
                <VolumePopoverButton currentVolume={playerState.volume} />
              </Flex>
            </Flex>
          )}
        </AnimatePresence>
      </Flex>
    </motion.div>
  );
};
