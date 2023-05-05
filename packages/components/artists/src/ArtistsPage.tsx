import { PageLayout } from "@spotless/components-shared";
import { useAllArtists } from "./hooks";
import { ArtistGrid } from "./ArtistGrid";
import { useFilter } from "./signals";

/**
 * Component that displays a grid of all artists that the user follows.
 */
export const ArtistsPage = () => {
  const filter = useFilter();
  const [data, isLoading] = useAllArtists(filter);

  return (
    <PageLayout isLoading={isLoading} title="Artists">
      <ArtistGrid artists={data} />
    </PageLayout>
  );
};
