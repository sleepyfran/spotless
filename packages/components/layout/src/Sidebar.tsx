import { Stack, Button, Navbar } from "@mantine/core";
import {
  IconDisc,
  IconHome2,
  IconPalette,
  IconSitemap,
} from "@tabler/icons-react";
import { Player } from "@spotless/component-player";

type SidebarButtonProps = {
  title: string;
  icon: JSX.Element;
};
const SidebarButton = ({ title, icon }: SidebarButtonProps) => {
  return (
    <Button variant="subtle" leftIcon={icon}>
      {title}
    </Button>
  );
};

/**
 * Shows the sidebar which allows the user to quickly navigate between the
 * different sections of the app... Well, you know what a sidebar usually is :^)
 */
export const Sidebar = () => {
  return (
    <Navbar width={{ base: 250 }}>
      <Navbar.Section grow mt="md">
        <Stack>
          <SidebarButton title="Home" icon={<IconHome2 />} />
          <SidebarButton title="Artists" icon={<IconPalette />} />
          <SidebarButton title="Albums" icon={<IconDisc />} />
          <SidebarButton title="Genres" icon={<IconSitemap />} />
        </Stack>
      </Navbar.Section>
      <Player />
    </Navbar>
  );
};
