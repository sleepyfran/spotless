import { Flex, Title, useMantineTheme } from "@mantine/core";
import { AlbumGrid } from "@spotless/components-albums";
import { PageLayout, useData } from "@spotless/components-shared";
import { useLiveQuery } from "dexie-react-hooks";

/**
 * Component for the home page, which shows the last 50 albums added to the
 * user's library.
 */
export const HomePage = () => {
  const { spacing } = useMantineTheme();
  const { albums } = useData();

  const data = useLiveQuery(() => albums.fetchN(10, "addedAt"));
  const isLoading = !data;

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
