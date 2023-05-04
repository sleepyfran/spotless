import { Artist } from "@spotless/types";
import { AlbumGrid, useArtistAlbums } from "@spotless/components-albums";
import { Flex, Loader } from "@mantine/core";
import { useEffect } from "react";

type ArtistDetailProps = {
  /**
   * Artist to display.
   */
  artist: Artist;
};

export const ArtistDetail = ({ artist }: ArtistDetailProps) => {
  const [data, isLoading] = useArtistAlbums(artist);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Flex align="center" gap="md">
      {isLoading ? <Loader /> : <AlbumGrid albums={data} />}
    </Flex>
  );
};
