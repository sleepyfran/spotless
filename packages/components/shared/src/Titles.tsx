import { useMantineTheme } from "@mantine/core";
import { Text } from "./Motion";

type TitleProps = {
  /**
   * Text to display.
   */
  title: string;

  /**
   * Size of the text.
   */
  size?: "md" | "xl" | string;

  /**
   * Overrides the number of lines that can be displayed. If none is specified,
   * it will default to 1.
   */
  clamp?: number;
};

/**
 * Component that shows the title of an album as a big text with a custom
 * gradient.
 */
export const Title = ({ title, size, clamp }: TitleProps) => {
  const { colors } = useMantineTheme();

  return (
    <Text
      variant="gradient"
      gradient={{ from: colors.orange[4], to: colors.red[4] }}
      fz={size}
      fw="bolder"
      lineClamp={clamp !== undefined ? clamp : 1}
    >
      {title}
    </Text>
  );
};
