import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { Artist } from "@spotless/types";

const [filter$, onFilterChange] = createSignal<string>();
const [selectedArtist$, setSelectedArtist] = createSignal<Artist | undefined>();

/**
 * Hook that returns the current filter
 */
const [useFilter] = bind(filter$, "");

/**
 * Hook that returns the currently selected artist.
 */
const [useSelectedArtist] = bind(selectedArtist$, undefined);

export { useFilter, onFilterChange };
export { useSelectedArtist, setSelectedArtist };
