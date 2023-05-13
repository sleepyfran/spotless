import {
  Text,
  Flex,
  Image,
  createStyles,
  Skeleton,
  Table,
  Button,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { Title, modals, useServices } from "@spotless/components-shared";
import { useAlbum } from "./hooks";
import { format } from "date-fns";
import { Album } from "@spotless/types";
import { AddToQueueButton, PlayButton } from "@spotless/components-player";
import { useState } from "react";

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
      {status.__type === "loaded" && (
        <Flex columnGap="sm" wrap="wrap">
          {status.album.genres.map((genre) => (
            <Text fz="sm" color="blue" key={genre}>
              {genre}
            </Text>
          ))}
        </Flex>
      )}
      {status.__type === "loaded" && (
        <Flex gap="sm">
          <PlayButton item={status.album} />
          <AddToQueueButton item={status.album} />
          <RemoveAlbumButton albumId={status.album.id} />
        </Flex>
      )}
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
          <Title title={status.album.name} size="2rem" clamp={2} />
        ) : (
          <Skeleton width={300} height="2rem" />
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
            <Text fz="sm" className={styles.classes.albumInfoItem}>
              {status.album.durationInMinutes} minutes
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

type RemoveAlbumStatus = "idle" | "clicked" | "loading" | "error";

const [, setModal] = modals;

const RemoveAlbumButton = ({ albumId }: { albumId: string }) => {
  const { library } = useServices();
  const [status, setStatus] = useState<RemoveAlbumStatus>("idle");

  const onClick = () => {
    switch (status) {
      case "idle":
        setStatus("clicked");
        break;
      case "clicked":
        setStatus("loading");
        library.removeAlbum(albumId).subscribe({
          complete: () => {
            setStatus("idle");
            setModal({ __type: "hidden" });
          },
          error: () => {
            setStatus("error");
          },
        });
        break;
    }
  };

  const label =
    status === "idle"
      ? "Remove"
      : status === "error"
      ? "Error. Click to try again"
      : status === "loading"
      ? "Removing..."
      : "Click to confirm";

  return (
    <Button
      variant="light"
      onClick={onClick}
      color="red"
      leftIcon={<IconTrash />}
      loading={status === "loading"}
    >
      {label}
    </Button>
  );
};
