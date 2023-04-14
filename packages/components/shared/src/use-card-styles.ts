import { createStyles } from "@mantine/core";

/**
 * Provides styles for a card-like component, such as an album or an artist, which
 * can be hovered and interacted with.
 */
export const useCardStyles = createStyles((theme) => ({
  card: {
    padding: theme.spacing.sm,
    ":hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.gray[8]
          : theme.colors.gray[3],
      borderRadius: theme.radius.md,
    },
  },
}));
