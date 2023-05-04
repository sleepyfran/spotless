import { Flex, Title, useMantineTheme, Loader } from "@mantine/core";
import { PropsWithChildren } from "react";

type PageLayoutProps = {
  title: string | React.ReactNode;
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
    <Flex direction="column" gap={spacing.md} w="100%" h="100%">
      <Flex align="center" gap={spacing.md}>
        {typeof title === "string" ? <Title>{title}</Title> : title}
        {isLoading && <Loader size="sm" />}
      </Flex>
      {children}
    </Flex>
  );
};
