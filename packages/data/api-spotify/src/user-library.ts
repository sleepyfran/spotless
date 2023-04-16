import { ApiClient, UserLibraryApi } from "@spotless/data-api";
import { map } from "rxjs";

export const createUserLibraryApi = (client: ApiClient): UserLibraryApi => ({
  getAlbums: ({ next, limit }) =>
    client
      .get<SpotifyApi.UsersSavedAlbumsResponse>(
        client.nextOrDefault(`/me/albums?limit=${limit || 50}`, next)
      )
      .pipe(
        map((response) => ({
          next: response.next || undefined,
          items: response.items.map((album) => ({
            id: album.album.id,
            name: album.album.name,
            artistName: album.album.artists[0].name,
            coverUrl: album.album.images[0].url,
            addedAt: new Date(album.added_at),
            releaseDate: new Date(album.album.release_date),
            totalTracks: album.album.total_tracks,
            trackList: album.album.tracks.items.map((track) => ({
              id: track.id,
              name: track.name,
              trackNumber: track.track_number,
              lengthInMs: track.duration_ms,
            })),
          })),
        }))
      ),
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
