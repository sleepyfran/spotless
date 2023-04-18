import { Flex as MantineFlex, createPolymorphicComponent } from "@mantine/core";
import { FlexProps } from "@mantine/core/lib/Flex";

/**
 * Wrapper around Mantine's Flex component that allows us to use it as a
 * polymorphic component so that we can apply motion to it.
 */
export const Flex = createPolymorphicComponent<"div", FlexProps>(MantineFlex);
