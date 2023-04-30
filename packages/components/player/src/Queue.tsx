import { Image } from "@mantine/core";
import { Flex, Title, Text, useCardStyles } from "@spotless/components-shared";
import { QueuedAlbum } from "@spotless/types";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type QueueItemProps = {
  /**
   * The item to be displayed.
   */
  album: QueuedAlbum;

  /**
   * Whether the track list is expanded without user interaction or not.
   */
  trackListExpandedByDefault: boolean;
};

/**
 * Component that displays a queued album that, when clicked, shows the
 * album's track list.
 */
export const QueuedAlbumItem = ({
  album: item,
  trackListExpandedByDefault,
}: QueueItemProps) => {
  const [expanded, setExpanded] = useState(trackListExpandedByDefault);
  const styles = useCardStyles();

  const onCardClick = () => setExpanded((exp) => !exp);

  return (
    <Flex
      component={motion.div}
      layout
      direction="column"
      gap="sm"
      className={styles.classes.card}
      onClick={onCardClick}
    >
      <Flex component={motion.div} layout gap="md">
        <Image src={item.coverUrl} height={50} width={50} radius="sm" />
        <Flex direction="column">
          <Title title={item.name} size="sm" />
          <Text size="sm" fw="lighter">
            {item.artistName}
          </Text>
        </Flex>
      </Flex>

      <AnimatePresence>
        {expanded && (
          <Flex component={motion.div} layout direction="column">
            {item.trackList.map((track, index) => (
              <Text
                key={track.id}
                fz="sm"
                fw="lighter"
                td={track.played ? "line-through" : ""}
              >
                {index + 1}. {track.name}
              </Text>
            ))}
          </Flex>
        )}
      </AnimatePresence>
    </Flex>
  );
};
