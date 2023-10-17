import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createRouter } from "./router";
import {
  DataContext,
  ServiceContext,
  initialize as initializeContexts,
} from "@spotless/components-shared";
import "./global-styles.scss";

const baseUrl = import.meta.env.VITE_BASE_APP;
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

if (!baseUrl || !clientId || !clientSecret) {
  document.body.innerHTML = "<h1>Missing environment variables</h1>";
  throw new Error(
    "Missing environment variables. Please make sure there is an .env file for this environment with a VITE_BASE_APP, VITE_CLIENT_ID and VITE_CLIENT_SECRET variable."
  );
}

const appConfig = {
  baseUrl,
  clientId,
  clientSecret,
};
const { services, data } = initializeContexts(appConfig);

const router = createRouter();
const Main = () => (
  <ServiceContext.Provider value={services}>
    <DataContext.Provider value={data}>
      <RouterProvider router={router} />
    </DataContext.Provider>
  </ServiceContext.Provider>
);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<Main />);
