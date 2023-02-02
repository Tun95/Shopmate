import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./Context/Context";
import { HelmetProvider } from "react-helmet-async";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ContextProvider>
    <HelmetProvider>
      <PayPalScriptProvider
        deferLoading={true}
        options={{ components: 'buttons' }}
      >
        <App />
      </PayPalScriptProvider>
    </HelmetProvider>
  </ContextProvider>
);
