import { useMantineTheme } from "@mantine/core";

/**
 * Returns the color palette of the application.
 */
export const useColors = () => {
  const theme = useMantineTheme();
  return {
    error: theme.colors.red[7],
  };
};
