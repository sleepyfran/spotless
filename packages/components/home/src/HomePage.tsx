import { Flex, Title, useMantineTheme } from "@mantine/core";
import { AlbumGrid } from "@spotless/components-albums";
import { PageLayout, useServices } from "@spotless/components-shared";
import { collectIntoArray } from "@spotless/services-rxjs";
import { useQuery } from "@tanstack/react-query";

/**
 * Component for the home page, which shows the last 50 albums added to the
 * user's library.
 */
export const Home = () => {
  const { spacing } = useMantineTheme();
  const { albumsService, cacheKeys } = useServices();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [cacheKeys.albums],
    queryFn: () => collectIntoArray(albumsService.fetchForHome()),
  });

  return (
    <PageLayout isLoading={isLoading || isFetching} title="Home">
      <Flex direction="column" gap={spacing.md}>
        <Title order={5}>Your last 50 albums</Title>
        <AlbumGrid albums={data} />
      </Flex>
    </PageLayout>
  );
};
