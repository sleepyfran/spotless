import { Flex, Loader, Grid, Title, useMantineTheme } from "@mantine/core";
import { AlbumCard } from "@spotless/components-albums";
import { useServices } from "@spotless/components-shared";
import { useQuery } from "@tanstack/react-query";

export const Home = () => {
  const { spacing } = useMantineTheme();
  const { albumsService } = useServices();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["home-albums"],
    queryFn: () => albumsService.home(),
  });

  return (
    <Flex direction="column" gap={10}>
      <Flex direction="column" pl={spacing.md}>
        <Flex align="center" gap={10}>
          <Title>Home</Title>
          {(isLoading || isFetching) && <Loader size="sm" />}
        </Flex>
        <Title order={5}>Last 50 albums</Title>
      </Flex>
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
  );
};
