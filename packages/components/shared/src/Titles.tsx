import { Text, useMantineTheme } from "@mantine/core";

type TitleProps = {
  title: string;
};

/**
 * Component that shows the title of an album as a big text with a custom
 * gradient.
 */
export const Title = ({ title }: TitleProps) => {
  const { colors } = useMantineTheme();

  return (
    <Text
      variant="gradient"
      gradient={{ from: colors.orange[4], to: colors.red[4] }}
      fz="lg"
      fw="bolder"
      lineClamp={1}
    >
      {title}
    </Text>
  );
};
