import { Flex, Grid, ActionIcon, Title } from "@mantine/core";
import { PageLayout, useData } from "@spotless/components-shared";
import { Artist } from "@spotless/types";
import { IconArrowLeft } from "@tabler/icons-react";
import { ArtistCard } from "./Artist";
import { useAllArtists } from "./hooks";
import { useState } from "react";
import { ArtistDetail } from "./ArtistDetail";

/**
 * Component that displays a grid of all artists that the user follows.
 */
export const ArtistsPage = () => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | undefined>(
    undefined
  );
  const { artists } = useData();

  const [data, isLoading] = useAllArtists(artists);

  return (
    <PageLayout
      isLoading={isLoading}
      title={
        selectedArtist ? (
          <ArtistTitle
            artist={selectedArtist}
            onBackClicked={() => setSelectedArtist(undefined)}
          />
        ) : (
          "Artists"
        )
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

  /**
   * Action to perform when the back button is clicked.
   */
  onBackClicked: () => void;
};

const ArtistTitle = ({ artist, onBackClicked }: ArtistTitleProps) => {
  return (
    <Flex align="center" gap="md">
      <ActionIcon size="xl" onClick={onBackClicked}>
        <IconArrowLeft />
      </ActionIcon>
      <Title>{artist.name}</Title>
    </Flex>
  );
};

type ArtistGridProps = {
  /**
   * Artists to display.
   */
  artists?: Artist[];

  /**
   * Action to perform when an artist is clicked.
   */
  onClick: (artist: Artist) => void;
};

const ArtistGrid = ({ artists, onClick }: ArtistGridProps) => {
  return (
    <Grid>
      {artists?.map((artist) => (
        <Grid.Col key={artist.id} xs={5} sm={4} md={3} xl={2}>
          <ArtistCard artist={artist} onClick={() => onClick(artist)} />
        </Grid.Col>
      ))}
    </Grid>
  );
};
