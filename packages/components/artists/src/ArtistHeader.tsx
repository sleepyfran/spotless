import { FilterInput } from "@spotless/components-shared";
import { useFilter, onFilterChange } from "./signals";
import { ChangeEventHandler } from "react";
import { Flex } from "@mantine/core";

export const ArtistHeader = () => {
  const currentFilter = useFilter();

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onFilterChange(event.target.value);
  };

  return (
    <Flex justify="center" gap="sm">
      <FilterInput
        value={currentFilter}
        placeholder="Filter artists"
        onChange={onChange}
      />
    </Flex>
  );
};
