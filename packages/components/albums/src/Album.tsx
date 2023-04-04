import { Flex, Image, Text, createStyles } from "@mantine/core";
import { SimpleAlbum } from "@spotless/types";

type AlbumProps = {
  album: SimpleAlbum;
};

const useStyles = createStyles((theme) => ({
  card: {
    padding: theme.spacing.sm,
    ":hover": {
      backgroundColor: theme.colors.gray[9],
      borderRadius: theme.radius.md,
    },
  },
}));

/**
 * Component that displays an album, including its name, artist name and cover image.
 */
export const AlbumCard = ({ album }: AlbumProps) => {
  const styles = useStyles();

  return (
    <Flex direction="column" align="center" className={styles.classes.card}>
      <Image src={album.coverUrl} width={150} height={150} radius="sm" />
      <Text fz="lg" variant="gradient" lineClamp={1}>
        {album.name}
      </Text>
      <Text fz="sm" c="dimmed" lineClamp={1}>
        {album.artistName}
      </Text>
    </Flex>
  );
};
