import { Flex, SegmentedControl } from "@mantine/core";
import { Paths } from "@spotless/components-shared";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Creates the main header of the app which displays each main section as a
 * segmented control and navigates to that section upon being selected.
 */
export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Flex justify="center" py="1rem">
      <SegmentedControl
        data={[
          { label: "Home", value: Paths.root },
          { label: "Artists", value: Paths.artists },
          { label: "Albums", value: Paths.albums },
          { label: "Genres", value: Paths.genres },
        ]}
        value={location.pathname}
        onChange={navigate}
        size="md"
        radius={16}
        fullWidth
      />
    </Flex>
  );
};
