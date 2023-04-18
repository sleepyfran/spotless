import { createSignal } from "@react-rxjs/utils";

/**
 * Defines all types of modals that we can open.
 */
export type Modal =
  | {
      __type: "hidden";
    }
  | {
      __type: "album";
      albumId: string;
    }
  | {
      __type: "artist";
      artistId: string;
    };

export const modals = createSignal<Modal>();
