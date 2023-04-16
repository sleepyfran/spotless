import {
  Text,
  Flex,
  Image,
  createStyles,
  Skeleton,
  Table,
} from "@mantine/core";
import { Title } from "@spotless/components-shared";
import { useAlbum } from "./hooks";
import { format } from "date-fns";
import { Album } from "@spotless/types";

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
export const AlbumDetails = ({ albumId }: AlbumDetailProps) => {
  const [album, loading] = useAlbum(albumId);

  const status: AlbumFetchStatus =
    loading || !album ? { __type: "loading" } : { __type: "loaded", album };

  return (
    <Flex gap={10} direction="column">
      <AlbumInfo status={status} />
      <AlbumTrackList status={status} />
    </Flex>
  );
};

type AlbumFetchStatus =
  | {
      __type: "loading";
    }
  | {
      __type: "loaded";
      album: Album;
    };

type AlbumDetailsChildProps = {
  status: AlbumFetchStatus;
};

const AlbumInfo = ({ status }: AlbumDetailsChildProps) => {
  const styles = useStyles();

  const loaded = status.__type === "loaded";
  const createTrackListSummary = (album: Album) =>
    album.totalTracks === 1 ? `1 track` : `${album.totalTracks} tracks`;

  return (
    <Flex gap={10} align="center">
      {loaded ? (
        <Image
          src={status.album.coverUrl}
          width={150}
          height={150}
          radius="sm"
        />
      ) : (
        <Skeleton width={150} height={150} radius="sm" />
      )}
      <Flex direction="column">
        {loaded ? (
          <Title title={status.album.name} size="3rem" />
        ) : (
          <Skeleton width={300} height="3rem" />
        )}
        {loaded ? (
          <Flex>
            <Text fz="sm">{status.album.artistName}</Text>
            <Text fz="sm" className={styles.classes.albumInfoItem}>
              {status.album.releaseDate.getFullYear()}
            </Text>
            <Text fz="sm" className={styles.classes.albumInfoItem}>
              {createTrackListSummary(status.album)}
            </Text>
          </Flex>
        ) : (
          <Skeleton width={150} height="1rem" />
        )}
      </Flex>
    </Flex>
  );
};

const AlbumTrackList = ({ status }: AlbumDetailsChildProps) => {
  const formatTrackLength = (lengthInMs: number) =>
    format(new Date(lengthInMs), "mm:ss");

  const loaded = status.__type === "loaded";

  return loaded ? (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Length</th>
        </tr>
      </thead>
      <tbody>
        {status.album.trackList.map((track) => (
          <tr key={track.id}>
            <td>{track.trackNumber}</td>
            <td>{track.name}</td>
            <td>{formatTrackLength(track.lengthInMs)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <Skeleton width="100%" height={300} />
  );
};
