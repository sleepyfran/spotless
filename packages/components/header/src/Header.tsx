import { Flex, SegmentedControl } from "@mantine/core";
import { Paths } from "@spotless/components-shared";
import { useMatches, useNavigate } from "react-router-dom";

/**
 * Creates the main header of the app which displays each main section as a
 * segmented control and navigates to that section upon being selected.
 */
export const Header = () => {
  const navigate = useNavigate();

  // TODO: This is a hacky way to get the currently matched location. Fix me?
  const matches = useMatches();
  const matchedLocation = matches[1] || matches[0];

  return (
    <Flex justify="center" py="1rem">
      <SegmentedControl
        data={[
          { label: "Home", value: Paths.root },
          { label: "Artists", value: Paths.artists },
          { label: "Albums", value: Paths.albums },
        ]}
        value={matchedLocation.pathname}
        onChange={navigate}
        size="md"
        radius={16}
        fullWidth
      />
    </Flex>
  );
};
