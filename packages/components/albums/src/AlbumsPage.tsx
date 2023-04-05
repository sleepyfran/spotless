import { AlbumGrid } from "@spotless/components-albums";
import { PageLayout, useServices } from "@spotless/components-shared";
import { collectIntoArray } from "@spotless/services-rxjs";
import { useQuery } from "@tanstack/react-query";

/**
 * Component for the albums page, which shows all the albums in the user's library.
 */
export const AlbumsPage = () => {
  const { albumsService, cacheKeys } = useServices();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [cacheKeys.allAlbums],
    queryFn: () => collectIntoArray(albumsService.fetchForAlbumsPage()),
  });

  return (
    <PageLayout isLoading={isLoading || isFetching} title="Albums">
      <AlbumGrid albums={data} />
    </PageLayout>
  );
};
