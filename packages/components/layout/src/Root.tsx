import { Title, AppShell } from "@mantine/core";
import { Sidebar } from "./Sidebar";
export const Root = () => (
  <AppShell navbar={<Sidebar />}>
    <Title order={1}>Welcome!</Title>
  </AppShell>
);
