import { Flex, Image, Text } from "@mantine/core";
import { useCardStyles } from "@spotless/components-shared";
import { Album } from "@spotless/types";

type AlbumProps = {
  album: Album;
};

/**
 * Component that displays an album, including its name, artist name and cover image.
 */
export const AlbumCard = ({ album }: AlbumProps) => {
  const styles = useCardStyles();

  return (
    <Flex direction="column" align="center" className={styles.classes.card}>
      <Image src={album.coverUrl} width={180} height={180} radius="sm" />
      <Text fz="lg" variant="gradient" lineClamp={1}>
        {album.name}
      </Text>
      <Text fz="sm" c="dimmed" lineClamp={1}>
        {album.artistName}
      </Text>
    </Flex>
  );
};
