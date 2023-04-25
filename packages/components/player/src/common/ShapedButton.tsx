import { ActionIcon, Button } from "@mantine/core";
import { MouseEventHandler } from "react";

export type ShapedButtonProps = {
  /**
   * Defines the style of the button. If not specified, defaults to "regular".
   */
  style?: "rounded" | "regular";

  /**
   * Defines the color of the button. If not specified, defaults to "green".
   */
  color?: "green" | "blue";

  /**
   * Icon to shown on the left side of the button, if any.
   */
  icon?: React.ReactNode;

  /**
   * Text to be shown on the button.
   */
  text?: string;

  /**
   * Whether the button is in a loading state.
   */
  loading?: boolean;

  /**
   * Callback to be called when the button is clicked.
   */
  onClick: MouseEventHandler<HTMLElement>;
};

/**
 * Component that displays a button in either regular or rounded style.
 */
export const ShapedButton = (props: ShapedButtonProps) => {
  return props.style === "rounded" ? (
    <RoundedShapedButton {...props} />
  ) : (
    <RegularShapedButton {...props} />
  );
};

const RegularShapedButton = ({
  icon,
  text,
  onClick,
  color,
}: ShapedButtonProps) => {
  return (
    <Button
      variant="light"
      onClick={onClick}
      color={color || "green"}
      leftIcon={icon}
    >
      {text}
    </Button>
  );
};

const RoundedShapedButton = ({
  icon,
  onClick,
  text,
  color,
}: ShapedButtonProps) => {
  return (
    <ActionIcon
      variant="filled"
      color={color || "green"}
      onClick={onClick}
      title={text}
      size="xl"
      radius="xl"
    >
      {icon}
    </ActionIcon>
  );
};
