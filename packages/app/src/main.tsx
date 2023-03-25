import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Subscribe } from "@react-rxjs/core";
import { FluentProvider, webDarkTheme } from "@fluentui/react-components";
import { router } from "./router";
import {
  ServiceContext,
  initializeServices,
} from "@spotless/component-core-context";

const services = initializeServices({
  baseUrl: import.meta.env.VITE_BASE_APP,
  clientId: import.meta.env.VITE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET,
});

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <FluentProvider theme={webDarkTheme}>
    <Subscribe>
      <ServiceContext.Provider value={services}>
        <RouterProvider router={router} />
      </ServiceContext.Provider>
    </Subscribe>
  </FluentProvider>
);
