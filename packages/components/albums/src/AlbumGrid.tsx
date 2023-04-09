import { Grid } from "@mantine/core";
import { AlbumCard } from "@spotless/components-albums";
import { Album } from "@spotless/types";

type AlbumGridProps = {
  albums: Album[] | undefined;
};

/**
 * Component that displays a grid of albums.
 */
export const AlbumGrid = ({ albums }: AlbumGridProps) =>
  albums ? (
    <Grid>
      {albums.map((album) => (
        <Grid.Col key={album.id} xs={5} sm={4} md={3} xl={2}>
          <AlbumCard album={album} />
        </Grid.Col>
      ))}
    </Grid>
  ) : null;
