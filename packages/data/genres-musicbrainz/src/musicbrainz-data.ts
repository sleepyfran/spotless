import { GenreDataSource } from "@spotless/data-genres";
import { Single, singleFrom } from "@spotless/services-rx";
import { Album } from "@spotless/types";
import { concatMap, map } from "rxjs";

type MusicBrainzReleaseGroupsResponse = {
  "release-groups": {
    id: string;
    title: string;
  }[];
};

type MusicBrainzReleaseGroupResponse = {
  genres: {
    name: string;
  }[];
};

/**
 * Implements the GenreDataSource interface using the MusicBrainz API as the
 * source.
 */
export class GenresMusicBrainzData implements GenreDataSource {
  public retrieveAllForAlbum(album: Album): Single<string[]> {
    const query = encodeURIComponent(`${album.artistName} - ${album.name}`);

    return singleFrom(
      fetch(`https://musicbrainz.org/ws/2/release-group?query=${query}`, {
        headers: this.headers,
      })
    ).pipe(
      concatMap((response) => response.json()),
      map(
        (response: MusicBrainzReleaseGroupsResponse) =>
          response["release-groups"][0]
      ),
      concatMap((releaseGroup) =>
        this.retrieveForReleaseGroupId(releaseGroup.id)
      )
    );
  }

  private retrieveForReleaseGroupId(id: string): Single<string[]> {
    return singleFrom(
      fetch(`https://musicbrainz.org/ws/2/release-group/${id}?inc=genres`, {
        headers: this.headers,
      })
    ).pipe(
      concatMap((response) => response.json()),
      map((response: MusicBrainzReleaseGroupResponse) =>
        response.genres.map((genre) => genre.name)
      )
    );
  }

  private get headers() {
    return {
      Accept: "application/json",
    };
  }
}
