import { Flex, Image, Text } from "@mantine/core";
import { SimpleAlbum } from "@spotless/types";

type AlbumProps = {
  album: SimpleAlbum;
};

/**
 * Component that displays an album, including its name, artist name and cover image.
 */
export const Album = ({ album }: AlbumProps) => (
  <Flex direction="column">
    <Image src={album.coverUrl} width={150} height={150} radius="sm" />
    <Text fz="lg" variant="gradient" truncate>
      {album.name}
    </Text>
    <Text fz="sm" c="dimmed" truncate>
      {album.artistName}
    </Text>
  </Flex>
);
