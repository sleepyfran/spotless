import { Flex, Title, useMantineTheme, Loader } from "@mantine/core";
import { PropsWithChildren } from "react";

type PageLayoutProps = {
  title: string;
  isLoading: boolean;
};

/**
 * A reusable layout for root pages like home, artists, albums, etc.
 */
export const PageLayout = ({
  title,
  isLoading,
  children,
}: PropsWithChildren<PageLayoutProps>) => {
  const { spacing } = useMantineTheme();

  return (
    <Flex direction="column" gap={spacing.md}>
      <Flex align="center" gap={spacing.md}>
        <Title>{title}</Title>
        {isLoading && <Loader size="sm" />}
      </Flex>
      {children}
    </Flex>
  );
};
