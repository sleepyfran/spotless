import { Image } from "@mantine/core";
import { Flex, Title, useCardStyles } from "@spotless/components-shared";
import { Artist } from "@spotless/types";
import { motion } from "framer-motion";

type ArtistProps = {
  /**
   * Artist to display.
   */
  artist: Artist;

  /**
   * Action to perform when the artist is clicked.
   */
  onClick?: () => void;
};

/**
 * Component that displays information about an artist, including their name and
 * main image.
 */
export const ArtistCard = ({ artist, onClick }: ArtistProps) => {
  const styles = useCardStyles();

  return (
    <Flex
      direction="column"
      align="center"
      className={styles.classes.card}
      component={motion.div}
      animate={{ opacity: [0, 1] }}
      transition={{ ease: "easeOut", duration: 0.2 }}
      whileHover={{ scale: [null, 1.05] }}
      onClick={onClick}
    >
      <Image src={artist.imageUrl} width={180} height={180} radius={100} />
      <Title title={artist.name}></Title>
    </Flex>
  );
};
