import { App } from "@/App";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";

import { AppProviders } from "@/providers/app.provider";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <AppProviders>
      <App />
    </AppProviders>
  </BrowserRouter>,
);
