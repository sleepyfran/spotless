import { Flex, Grid } from "@mantine/core";
import { Artist } from "@spotless/types";
import { ArtistCard } from "./Artist";
import { ArtistHeader as ArtistsHeader } from "./ArtistHeader";
import { useNavigate } from "react-router-dom";
import { Paths } from "@spotless/components-shared";

type ArtistGridProps = {
  /**
   * Artists to display.
   */
  artists?: Artist[];
};

/**
 * Component that displays a grid of artists and a filter for them
 */
export const ArtistGrid = ({ artists }: ArtistGridProps) => {
  const navigate = useNavigate();

  const onArtistClick = (artist: Artist) => {
    navigate(Paths.artist(artist.id));
  };

  return (
    <Flex direction="column" gap="md">
      <ArtistsHeader />
      <Grid>
        {artists?.map((artist) => (
          <Grid.Col key={artist.id} xs={5} sm={4} md={3} xl={2}>
            <ArtistCard artist={artist} onClick={() => onArtistClick(artist)} />
          </Grid.Col>
        ))}
      </Grid>
    </Flex>
  );
};
