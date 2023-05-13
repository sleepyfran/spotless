import { describe, test, expect } from "@jest/globals";
import { GenresMusicBrainzData } from "./musicbrainz-data";
import { lastValueFrom } from "rxjs";
import { Album } from "@spotless/types";

/**
 * E2E test for the MusicBrainz data source. These might be flaky if any of the
 * tags change or the MusicBrainz API throttles us, so we only run them when
 * explicitly requested via the e2e flag.
 */
describe("MusicBrainz data source e2e", () => {
  test.each([
    [
      "Steven Wilson",
      "The Raven That Refused to Sing (and Other Stories)",
      [
        "rock",
        "alternative rock",
        "progressive rock",
        "jazz rock",
        "art rock",
        "avant-garde jazz",
      ],
    ],
    [
      "Deafheaven",
      "Sunbather",
      ["shoegaze", "black metal", "post-metal", "blackgaze"],
    ],
    ["Owen", "The Avalanche", ["rock", "indie folk"]],
    [
      "Portico Quartet",
      "Monument",
      ["electronic", "jazz", "contemporary jazz"],
    ],
    ["Benévola", "Luz guía", []],
    ["Viva Belgrado", "Ulises", ["screamo", "post-rock", "punk"]],
  ])(
    "correctly fetches genres for %s's %s, that have count > 1",
    async (artistName, albumName, expectedGenres) => {
      const source = new GenresMusicBrainzData();
      const genres = await lastValueFrom(
        source.retrieveAllForAlbum({
          artistName,
          name: albumName,
        } as Album)
      );
      expect(genres).toEqual(expect.arrayContaining(expectedGenres));
    }
  );
});
