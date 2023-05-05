import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";

const [filter$, onFilterChange] = createSignal<string>();

/**
 * Hook that returns the current filter
 */
const [useFilter] = bind(filter$, "");

export { useFilter, onFilterChange };
