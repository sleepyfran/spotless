import { Flex, Title, useMantineTheme } from "@mantine/core";
import { AlbumGrid, useNAlbums } from "@spotless/components-albums";
import { PageLayout } from "@spotless/components-shared";
import { FetchOptions } from "@spotless/data-db";
import { Album } from "@spotless/types";

const homePageFilter: FetchOptions<Album> = {
  limit: 10,
  orderBy: {
    key: "addedAt",
    direction: "desc",
  },
};

/**
 * Component for the home page, which shows the last 50 albums added to the
 * user's library.
 */
export const HomePage = () => {
  const { spacing } = useMantineTheme();

  const [data, isLoading] = useNAlbums(homePageFilter);

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
