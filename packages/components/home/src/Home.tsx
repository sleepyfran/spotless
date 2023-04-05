import { Flex, Grid, Title, useMantineTheme } from "@mantine/core";
import { AlbumCard } from "@spotless/components-albums";
import { PageLayout, useServices } from "@spotless/components-shared";
import { useQuery } from "@tanstack/react-query";

/**
 * Component for the home page, which shows the last 50 albums added to the
 * user's library.
 */
export const Home = () => {
  const { spacing } = useMantineTheme();
  const { albumsService } = useServices();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["home-albums"],
    queryFn: () => albumsService.home(),
  });

  return (
    <PageLayout isLoading={isLoading || isFetching} title="Home">
      <Flex direction="column" gap={spacing.md}>
        <Title order={5}>Your last 50 albums</Title>
        {data && (
          <Grid>
            {data?.map((album) => (
              <Grid.Col key={album.id} xs={5} sm={4} md={3} xl={2}>
                <AlbumCard album={album} />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Flex>
    </PageLayout>
  );
};
