import { Image, createStyles } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  Flex,
  Title,
  Text,
  useCardStyles,
  modals,
} from "@spotless/components-shared";
import { AddToQueueButton, PlayButton } from "@spotless/components-player";
import { Album } from "@spotless/types";
import { motion } from "framer-motion";

type AlbumProps = {
  album: Album;
};

const usePlayableImageStyles = createStyles({
  playableImageRoot: {
    position: "relative",
  },
  actionButtons: {
    position: "absolute",
    top: "70%",
    left: "48%",
  },
});

const [, setModal] = modals;

/**
 * Component that displays an album, including its name, artist name and cover image.
 */
export const AlbumCard = ({ album }: AlbumProps) => {
  const { hovered, ref } = useHover();
  const cardStyles = useCardStyles();
  const playableImageStyles = usePlayableImageStyles();

  const onCardClick = () => setModal({ __type: "album", albumId: album.id });

  return (
    <Flex
      ref={ref}
      direction="column"
      align="center"
      className={cardStyles.classes.card}
      onClick={onCardClick}
      component={motion.div}
      animate={{ opacity: [0, 1] }}
      transition={{ ease: "easeOut", duration: 0.2 }}
      whileHover={{ scale: [null, 1.05] }}
    >
      <div className={playableImageStyles.classes.playableImageRoot}>
        <Image src={album.coverUrl} width={180} height={180} radius="sm" />
        {hovered && (
          <Flex className={playableImageStyles.classes.actionButtons} gap={2}>
            <AddToQueueButton style="rounded" item={album} />
            <PlayButton style="rounded" item={album} />
          </Flex>
        )}
      </div>
      <Title title={album.name} />
      <Text fz="sm" c="dimmed" lineClamp={1}>
        {album.artistName}
      </Text>
    </Flex>
  );
};
