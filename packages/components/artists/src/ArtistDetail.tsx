import { AlbumType, Artist } from "@spotless/types";
import {
  AlbumsSection,
  useGroupedArtistAlbums,
} from "@spotless/components-albums";
import { Flex, Loader } from "@mantine/core";

type ArtistDetailProps = {
  /**
   * Artist to display.
   */
  artist: Artist;
};

export const ArtistDetail = ({ artist }: ArtistDetailProps) => {
  const data = useGroupedArtistAlbums(artist);

  return (
    <Flex align="center" gap="md">
      {!data ? (
        <Loader />
      ) : (
        <Flex direction="column" gap="xl" w="100%">
          <AlbumsSection type={AlbumType.Album} groupedAlbums={data} />
          <AlbumsSection type={AlbumType.EP} groupedAlbums={data} />
          <AlbumsSection type={AlbumType.Single} groupedAlbums={data} />
        </Flex>
      )}
    </Flex>
  );
};
