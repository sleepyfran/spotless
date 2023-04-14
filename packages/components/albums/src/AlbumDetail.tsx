import {
  Text,
  Flex,
  Image,
  createStyles,
  Skeleton,
  Table,
} from "@mantine/core";
import { Title, useColors } from "@spotless/components-shared";
import { useAlbum } from "./hooks";
import { format } from "date-fns";

type AlbumDetailProps = {
  albumId: string;
};

const useStyles = createStyles({
  albumInfoItem: {
    ":before": {
      content: '"•"',
      margin: "0 0.2rem",
    },
  },
});

/**
 * Shows the details of an album and its track list.
 */
export const AlbumDetail = ({ albumId }: AlbumDetailProps) => {
  const styles = useStyles();
  const [album, loading] = useAlbum(albumId);

  const trackListSummary =
    album?.totalTracks === 1 ? `1 track` : `${album?.totalTracks} tracks`;

  const formatTrackLength = (lengthInMs: number) =>
    format(new Date(lengthInMs), "mm:ss");

  return (
    <Flex direction="column">
      {loading ? (
        <>
          <Flex gap={10} direction="column">
            <Flex gap={10} align="center">
              <Skeleton width={150} height={150} radius="sm" />
              <Flex direction="column" gap={2}>
                <Skeleton width={300} height={50} />
                <Skeleton width={150} height={20} />
              </Flex>
            </Flex>
            <Skeleton width="100%" height={300} />
          </Flex>
        </>
      ) : album ? (
        <>
          <Flex gap={10} direction="column">
            <Flex gap={10} align="center">
              <Image
                src={album.coverUrl}
                width={150}
                height={150}
                radius="sm"
              />
              <Flex direction="column">
                <Title title={album.name} size="3rem" />
                <Flex>
                  <Text fz="sm">{album.artistName}</Text>
                  <Text fz="sm" className={styles.classes.albumInfoItem}>
                    {album.releaseDate.getFullYear()}
                  </Text>
                  <Text fz="sm" className={styles.classes.albumInfoItem}>
                    {trackListSummary}
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Length</th>
                </tr>
              </thead>
              <tbody>
                {album.trackList.map((track) => (
                  <tr key={track.id}>
                    <td>{track.trackNumber}</td>
                    <td>{track.name}</td>
                    <td>{formatTrackLength(track.lengthInMs)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Flex>
        </>
      ) : (
        <AlbumDetailError />
      )}
    </Flex>
  );
};

const AlbumDetailError = () => {
  const colors = useColors();

  return (
    <Text color={colors.error}>
      There was an error while retrieving the album, try again
    </Text>
  );
};
