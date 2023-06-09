import { Flex, Input } from "@mantine/core";
import { AlbumGrid } from "@spotless/components-albums";
import { PageLayout } from "@spotless/components-shared";
import { IconSearch } from "@tabler/icons-react";
import { useAllAlbums } from "./hooks";
import { useState } from "react";
import { Shuffle } from "./Shuffle";

/**
 * Component for the albums page, which shows all the albums in the user's library.
 */
export const AlbumsPage = () => {
  const [filter, setFilter] = useState("");
  const [data, isLoading] = useAllAlbums(
    filter.length > 0 ? filter : undefined
  );

  const onFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  return (
    <PageLayout isLoading={isLoading} title="Albums">
      <Flex justify="center" gap="sm">
        <Input
          icon={<IconSearch />}
          placeholder="Filter albums"
          value={filter}
          onChange={onFilterChange}
          width={200}
        />
        <Shuffle items={data} />
      </Flex>
      <AlbumGrid albums={data} />
    </PageLayout>
  );
};
