import { Flex, Image, Text } from "@mantine/core";
import { Title, useCardStyles } from "@spotless/components-shared";
import { QueueItem } from "@spotless/types";

type QueueItemProps = {
  /**
   * The item to be displayed.
   */
  item: QueueItem;
};

export const QueuedTrackItem = ({ item }: QueueItemProps) => {
  const styles = useCardStyles();

  return (
    <Flex gap="md" className={styles.classes.card}>
      <Image src={item.coverUrl} height={50} width={50} radius="sm" />
      <Flex direction="column">
        <Title title={item.trackName} size="sm" />
        <Text size="sm" fw="lighter">
          {item.artistName}
        </Text>
      </Flex>
    </Flex>
  );
};
