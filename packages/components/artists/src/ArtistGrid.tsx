import { Flex, Grid } from "@mantine/core";
import { Artist } from "@spotless/types";
import { ArtistCard } from "./Artist";
import { ArtistHeader as ArtistsHeader } from "./ArtistHeader";

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

/**
 * Component that displays a grid of artists and a filter for them
 */
export const ArtistGrid = ({ artists, onClick }: ArtistGridProps) => {
  return (
    <Flex direction="column" gap="md">
      <ArtistsHeader />
      <Grid>
        {artists?.map((artist) => (
          <Grid.Col key={artist.id} xs={5} sm={4} md={3} xl={2}>
            <ArtistCard artist={artist} onClick={() => onClick(artist)} />
          </Grid.Col>
        ))}
      </Grid>
    </Flex>
  );
};
