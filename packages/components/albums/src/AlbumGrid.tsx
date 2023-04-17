import { Grid } from "@mantine/core";
import { AlbumCard } from "@spotless/components-albums";
import { Album } from "@spotless/types";
import { memo } from "react";

type AlbumGridProps = {
  albums: Album[] | undefined;
};

/**
 * Component that displays a grid of albums.
 */
export const AlbumGrid = memo(({ albums }: AlbumGridProps) =>
  albums ? (
    <Grid h="100%" w="100%">
      {albums.map((album) => (
        <Grid.Col key={album.id} xs={5} sm={4} md={3} xl={2}>
          <AlbumCard album={album} />
        </Grid.Col>
      ))}
    </Grid>
  ) : null
);
AlbumGrid.displayName = "AlbumGrid";
