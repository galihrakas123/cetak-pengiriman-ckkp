import React from "react";
import ReactDOM from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";

import App from "./App.tsx";
import { ConfigContextProvider } from "./contexts/configContext.tsx";

import "./index.scss";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <ConfigContextProvider>
        <App />
      </ConfigContextProvider>
    </PrimeReactProvider>
  </React.StrictMode>
);
