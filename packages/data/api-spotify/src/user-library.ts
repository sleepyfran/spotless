import { AlbumType, Track } from "@spotless/types";
import { ApiClient, UserLibraryApi } from "@spotless/data-api";
import { map } from "rxjs";

const albumTypeFromTrackList = (
  trackList: Track[],
  totalLengthInMinutes: number
) => {
  if (totalLengthInMinutes >= 30) {
    return AlbumType.Album;
  }

  return trackList.length > 1 ? AlbumType.EP : AlbumType.Single;
};

export const createUserLibraryApi = (client: ApiClient): UserLibraryApi => ({
  getAlbums: ({ next, limit }) =>
    client
      .get<SpotifyApi.UsersSavedAlbumsResponse>(
        client.nextOrDefault(`/me/albums?limit=${limit || 50}`, next)
      )
      .pipe(
        map((response) => ({
          next: response.next || undefined,
          items: response.items.map((album) => {
            const trackList = album.album.tracks.items.map((track) => ({
              id: track.id,
              name: track.name,
              trackNumber: track.track_number,
              lengthInMs: track.duration_ms,
            }));

            const durationInMs = trackList.reduce(
              (total, track) => total + track.lengthInMs,
              0
            );
            const durationInMinutes = Math.round(durationInMs / 1000 / 60);

            return {
              id: album.album.id,
              name: album.album.name,
              type: albumTypeFromTrackList(trackList, durationInMinutes),
              artistName: album.album.artists[0].name,
              artistId: album.album.artists[0].id,
              coverUrl: album.album.images[0].url,
              addedAt: new Date(album.added_at),
              genres: [],
              releaseDate: new Date(album.album.release_date),
              durationInMinutes,
              totalTracks: album.album.total_tracks,
              trackList,
            };
          }),
        }))
      ),
  removeAlbum: (id) => client.delete(`/me/albums?ids=${id}`),
  getArtists: ({ next, limit }) =>
    client
      .get<SpotifyApi.UsersFollowedArtistsResponse>(
        client.nextOrDefault(
          `/me/following?type=artist&limit=${limit || 50}`,
          next
        )
      )
      .pipe(
        map((response) => ({
          next: response.artists.next || undefined,
          items: response.artists.items.map((artist) => ({
            id: artist.id,
            name: artist.name,
            imageUrl: artist.images[0].url,
          })),
        }))
      ),
});
