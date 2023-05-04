import { Flex, ActionIcon, Title } from "@mantine/core";
import { PageLayout } from "@spotless/components-shared";
import { Artist } from "@spotless/types";
import { IconArrowLeft } from "@tabler/icons-react";
import { useAllArtists } from "./hooks";
import { ArtistDetail } from "./ArtistDetail";
import { ArtistGrid } from "./ArtistGrid";
import { setSelectedArtist, useFilter, useSelectedArtist } from "./signals";

/**
 * Component that displays a grid of all artists that the user follows.
 */
export const ArtistsPage = () => {
  const filter = useFilter();
  const selectedArtist = useSelectedArtist();

  const [data, isLoading] = useAllArtists(filter);

  return (
    <PageLayout
      isLoading={isLoading}
      title={
        selectedArtist ? <ArtistTitle artist={selectedArtist} /> : "Artists"
      }
    >
      {selectedArtist ? (
        <ArtistDetail artist={selectedArtist} />
      ) : (
        <ArtistGrid artists={data} onClick={setSelectedArtist} />
      )}
    </PageLayout>
  );
};

type ArtistTitleProps = {
  /**
   * Artist to display.
   */
  artist: Artist;
};

const ArtistTitle = ({ artist }: ArtistTitleProps) => {
  return (
    <Flex align="center" gap="md">
      <ActionIcon size="xl" onClick={() => setSelectedArtist(undefined)}>
        <IconArrowLeft />
      </ActionIcon>
      <Title>{artist.name}</Title>
    </Flex>
  );
};
