import { makeStyles, shorthands, Title1 } from "@fluentui/react-components";
import { Flex } from "../shared/Flex";
import { Sidebar } from "./sidebar";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    ...shorthands.gap("1rem"),
  },
  sidebar: {
    width: "15rem",
  },
});

export const Root = () => {
  const styles = useStyles();

  return (
    <Flex className={styles.root}>
      <Sidebar className={styles.sidebar} />
      <main>
        <Title1>Welcome!</Title1>
      </main>
    </Flex>
  );
};
