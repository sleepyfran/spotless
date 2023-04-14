import { createSignal } from "@react-rxjs/utils";

/**
 * Defines all types of modals that we can open.
 */
export type Modal =
  | {
      __type: "Album";
      albumId: string;
    }
  | {
      __type: "Artist";
      artistId: string;
    };

export const modals = createSignal<Modal | undefined>();
