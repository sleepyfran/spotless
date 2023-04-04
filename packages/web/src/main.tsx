import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { router } from "./router";
import {
  ServiceContext,
  initialize as initializeServices,
} from "@spotless/components-shared";

const init = async () => {
  const services = await initializeServices({
    baseUrl: import.meta.env.VITE_BASE_APP,
    clientId: import.meta.env.VITE_CLIENT_ID,
    clientSecret: import.meta.env.VITE_CLIENT_SECRET,
  });

  const root = createRoot(document.getElementById("root") as HTMLElement);
  root.render(
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{ colorScheme: "dark" }}
    >
      <ServiceContext.Provider value={services}>
        <RouterProvider router={router} />
      </ServiceContext.Provider>
    </MantineProvider>
  );
};

init();
