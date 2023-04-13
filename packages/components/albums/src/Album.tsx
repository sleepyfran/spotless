import { Flex, Image, Text, createStyles } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useCardStyles, PlayButton } from "@spotless/components-shared";
import { Album } from "@spotless/types";

type AlbumProps = {
  album: Album;
};

const usePlayableImageStyles = createStyles({
  playableImageRoot: {
    position: "relative",
  },
  playButton: {
    position: "absolute",
    top: "70%",
    left: "70%",
  },
});

/**
 * Component that displays an album, including its name, artist name and cover image.
 */
export const AlbumCard = ({ album }: AlbumProps) => {
  const { hovered, ref } = useHover();
  const cardStyles = useCardStyles();
  const playableImageStyles = usePlayableImageStyles();

  return (
    <Flex
      ref={ref}
      direction="column"
      align="center"
      className={cardStyles.classes.card}
    >
      <div className={playableImageStyles.classes.playableImageRoot}>
        <Image src={album.coverUrl} width={180} height={180} radius="sm" />
        {hovered && (
          <PlayButton
            item={album}
            className={playableImageStyles.classes.playButton}
          />
        )}
      </div>
      <Text fz="lg" variant="gradient" lineClamp={1}>
        {album.name}
      </Text>
      <Text fz="sm" c="dimmed" lineClamp={1}>
        {album.artistName}
      </Text>
    </Flex>
  );
};
