import { useMantineTheme } from "@mantine/core";

/**
 * Color for showing errors to the user.
 */
export const useErrorColor = () => {
  const theme = useMantineTheme();
  return theme.colors.red[7];
};
