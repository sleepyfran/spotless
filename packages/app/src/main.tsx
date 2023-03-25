import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Subscribe } from "@react-rxjs/core";
import { FluentProvider, webDarkTheme } from "@fluentui/react-components";
import { router } from "./router";
import * as Services from "./service-context";

const services = Services.initialize({
  baseUrl: import.meta.env.VITE_BASE_APP,
  clientId: import.meta.env.VITE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET,
});

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <FluentProvider theme={webDarkTheme}>
    <Subscribe>
      <Services.ServiceContext.Provider value={services}>
        <RouterProvider router={router} />
      </Services.ServiceContext.Provider>
    </Subscribe>
  </FluentProvider>
);
