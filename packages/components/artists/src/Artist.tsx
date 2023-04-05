import { Flex, Text, Image } from "@mantine/core";
import { useCardStyles } from "@spotless/components-shared";
import { SimpleArtist } from "@spotless/types";

type ArtistProps = {
  artist: SimpleArtist;
};

/**
 * Component that displays information about an artist, including their name and
 * main image.
 */
export const Artist = ({ artist }: ArtistProps) => {
  const styles = useCardStyles();

  return (
    <Flex direction="column" align="center" className={styles.classes.card}>
      <Image src={artist.imageUrl} width={180} height={180} radius={100} />
      <Text fz="lg" variant="gradient" lineClamp={1}>
        {artist.name}
      </Text>
    </Flex>
  );
};
