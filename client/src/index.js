import AppProviders from "AppProviders";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById("root")
);
