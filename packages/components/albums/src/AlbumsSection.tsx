import { Flex, Title } from "@mantine/core";
import { AlbumType, GroupedAlbums } from "@spotless/types";
import { AlbumGrid } from "./AlbumGrid";

type AlbumsSectionProps = {
  /**
   * Type that this section displays.
   */
  type: AlbumType;

  /**
   * Grouped albums to display.
   */
  groupedAlbums: GroupedAlbums;
};

/**
 * Displays a section with a specific type of albums.
 */
export const AlbumsSection = ({ type, groupedAlbums }: AlbumsSectionProps) => {
  return groupedAlbums[type].length > 0 ? (
    <Flex direction="column" gap="md" w="100%">
      <Title order={3} ml="3.8rem" fw="lighter">
        {type === AlbumType.Album
          ? "Albums"
          : type === AlbumType.EP
          ? "EPs"
          : "Singles"}
      </Title>
      <AlbumGrid albums={groupedAlbums[type]} />
    </Flex>
  ) : null;
};
