import { Flex, Loader, Grid, Title } from "@mantine/core";
import { Album } from "@spotless/components-albums";
import { useServices } from "@spotless/components-shared";
import { useQuery } from "@tanstack/react-query";

export const Home = () => {
  const { albumsService } = useServices();

  const { data, isLoading } = useQuery({
    queryKey: ["home-albums"],
    queryFn: () => albumsService.home(),
  });

  return (
    <Flex direction="column" gap={10}>
      <Title>Home</Title>
      <Title order={5}>Last 50 albums</Title>
      {isLoading && <Loader size="xl" />}
      <Grid>
        {data?.map((album) => (
          <Grid.Col key={album.id} xs={4} sm={3} md={2} xl={1}>
            <Album album={album} />
          </Grid.Col>
        ))}
      </Grid>
    </Flex>
  );
};
