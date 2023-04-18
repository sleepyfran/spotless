import { Text as MantineText, createPolymorphicComponent } from "@mantine/core";
import { TextProps } from "@mantine/core/lib/Text";
import { motion } from "framer-motion";

const InternalText = createPolymorphicComponent<"div", TextProps>(MantineText);

/**
 * Wrapper around Mantine's Text component that allows us to use it as a
 * polymorphic component so that we can apply motion to it. Sets the component
 * to div by default and its layout to position so that it animates correctly.
 */
export const Text = (props: TextProps) => (
  <InternalText {...props} component={motion.div} layout="position" />
);
