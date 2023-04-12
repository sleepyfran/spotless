import { Flex, Title, useMantineTheme } from "@mantine/core";
import { AlbumGrid, useAlbums } from "@spotless/components-albums";
import { PageLayout, useData } from "@spotless/components-shared";

/**
 * Component for the home page, which shows the last 50 albums added to the
 * user's library.
 */
export const HomePage = () => {
  const { spacing } = useMantineTheme();
  const { albums } = useData();

  const [data, isLoading] = useAlbums(albums, 10, "addedAt");

  return (
    <PageLayout isLoading={isLoading} title="Home">
      <Flex direction="column" gap={spacing.md}>
        <Title order={5}>
          {data ? `Your last ${data.length} albums` : "Your latest albums"}
        </Title>
        <AlbumGrid albums={data} />
      </Flex>
    </PageLayout>
  );
};
