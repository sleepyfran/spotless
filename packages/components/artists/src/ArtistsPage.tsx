import { Flex, useMantineTheme, Grid } from "@mantine/core";
import { PageLayout, useData } from "@spotless/components-shared";
import { ArtistCard } from "./Artist";
import { useLiveQuery } from "dexie-react-hooks";

/**
 * Component that displays a grid of all artists that the user follows.
 */
export const ArtistsPage = () => {
  const { spacing } = useMantineTheme();
  const { artists } = useData();

  const data = useLiveQuery(() => artists.allArtistsByName());
  const isLoading = !data;

  return (
    <PageLayout isLoading={isLoading} title="Artists">
      <Flex direction="column" gap={spacing.md}>
        {data && (
          <Grid>
            {data.map((artist) => (
              <Grid.Col key={artist.id} xs={5} sm={4} md={3} xl={2}>
                <ArtistCard artist={artist} />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Flex>
    </PageLayout>
  );
};
