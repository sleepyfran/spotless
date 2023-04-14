import { Flex, Image } from "@mantine/core";
import { Title, useCardStyles } from "@spotless/components-shared";
import { Artist } from "@spotless/types";

type ArtistProps = {
  artist: Artist;
};

/**
 * Component that displays information about an artist, including their name and
 * main image.
 */
export const ArtistCard = ({ artist }: ArtistProps) => {
  const styles = useCardStyles();

  return (
    <Flex direction="column" align="center" className={styles.classes.card}>
      <Image src={artist.imageUrl} width={180} height={180} radius={100} />
      <Title title={artist.name}></Title>
    </Flex>
  );
};
