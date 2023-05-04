import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { ChangeEventHandler } from "react";

type FilterInputProps = {
  /**
   * Value of the filter.
   */
  value: string;

  /**
   * Placeholder to display in the input.
   */
  placeholder: string;

  /**
   * Action to perform when the filter changes.
   */
  onChange: ChangeEventHandler<HTMLInputElement>;
};

/**
 * Component that displays an input for filtering albums.
 */
export const FilterInput = ({
  value,
  placeholder,
  onChange,
}: FilterInputProps) => {
  return (
    <Input
      icon={<IconSearch />}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      width={200}
    />
  );
};
