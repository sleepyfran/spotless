import {
  ToggleButton,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import {
  Album24Regular,
  DocumentPageNumber24Regular,
  Home24Regular,
  Person24Regular,
} from "@fluentui/react-icons";
import { HTMLAttributes } from "react";
import { Flex } from "@spotless/component-shared";

const useButtonStyles = makeStyles({
  button: {
    justifyContent: "start",
  },
});

type SidebarButtonProps = {
  title: string;
  icon: JSX.Element;
};
const SidebarButton = ({ title, icon }: SidebarButtonProps) => {
  const styles = useButtonStyles();

  return (
    <ToggleButton appearance="subtle" icon={icon} className={styles.button}>
      {title}
    </ToggleButton>
  );
};

const useSidebarStyles = makeStyles({
  root: {
    paddingTop: "2rem",
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

/**
 * Shows the sidebar which allows the user to quickly navigate between the
 * different sections of the app... Well, you know what a sidebar usually is :^)
 */
export const Sidebar = ({ className }: HTMLAttributes<HTMLDivElement>) => {
  const sidebarStyles = useSidebarStyles();
  const styles = mergeClasses(sidebarStyles.root, className);

  return (
    <Flex column className={styles}>
      <SidebarButton title="Home" icon={<Home24Regular />} />
      <SidebarButton title="Artists" icon={<Person24Regular />} />
      <SidebarButton title="Albums" icon={<Album24Regular />} />
      <SidebarButton title="Genres" icon={<DocumentPageNumber24Regular />} />
    </Flex>
  );
};
