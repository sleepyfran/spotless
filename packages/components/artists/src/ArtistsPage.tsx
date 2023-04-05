import { Flex, useMantineTheme, Grid } from "@mantine/core";
import { PageLayout, useServices } from "@spotless/components-shared";
import { useQuery } from "@tanstack/react-query";
import { Artist } from "./Artist";

/**
 * Component that displays a grid of all artists that the user follows.
 */
export const ArtistsPage = () => {
  const { spacing } = useMantineTheme();
  const { artistsService, cacheKeys } = useServices();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [cacheKeys.artists],
    queryFn: () => artistsService.fetchForArtistsPage(),
  });

  return (
    <PageLayout isLoading={isLoading || isFetching} title="Artists">
      <Flex direction="column" gap={spacing.md}>
        {data && (
          <Grid>
            {data?.map((artist) => (
              <Grid.Col key={artist.id} xs={5} sm={4} md={3} xl={2}>
                <Artist artist={artist} />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Flex>
    </PageLayout>
  );
};
