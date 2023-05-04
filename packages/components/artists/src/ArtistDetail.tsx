import { AlbumType, Artist } from "@spotless/types";
import { AlbumsSection, useArtistAlbums } from "@spotless/components-albums";
import { Flex, Loader } from "@mantine/core";
import { useEffect } from "react";

type ArtistDetailProps = {
  /**
   * Artist to display.
   */
  artist: Artist;
};

export const ArtistDetail = ({ artist }: ArtistDetailProps) => {
  const data = useArtistAlbums(artist);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
