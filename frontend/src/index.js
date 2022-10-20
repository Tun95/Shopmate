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
        options={{ components: "buttons" }}
      >
        <App />
      </PayPalScriptProvider>
    </HelmetProvider>
  </ContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
