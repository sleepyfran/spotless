import { AlbumGrid } from "@spotless/components-albums";
import { PageLayout, useData } from "@spotless/components-shared";
import { useAllAlbums } from "./hooks";

/**
 * Component for the albums page, which shows all the albums in the user's library.
 */
export const AlbumsPage = () => {
  const { albums } = useData();

  const [data, isLoading] = useAllAlbums(albums);

  return (
    <PageLayout isLoading={isLoading} title="Albums">
      <AlbumGrid albums={data} />
    </PageLayout>
  );
};
