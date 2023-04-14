import { ApiClient, AlbumApi } from "@spotless/data-api";
import { map } from "rxjs";

export const createAlbumApi = (client: ApiClient): AlbumApi => ({
  get: (id) =>
    client.get<SpotifyApi.AlbumObjectFull>(`/albums/${id}`).pipe(
      map((album: SpotifyApi.AlbumObjectFull) => ({
        id: album.id,
        name: album.name,
        artistName: album.artists[0].name,
        coverUrl: album.images[0].url,
        releaseDate: new Date(album.release_date),
        totalTracks: album.total_tracks,
        trackList: album.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artistName: track.artists[0].name,
          trackNumber: track.track_number,
          lengthInMs: track.duration_ms,
        })),
      }))
    ),
});
