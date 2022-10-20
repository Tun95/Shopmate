import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./Context/Context";
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ContextProvider>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ContextProvider>
);
