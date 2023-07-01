import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

ReactDOM.render(
  <React.StrictMode>
    <App logFile="/frontend-log-sample.json" />
  </React.StrictMode>,
  document.getElementById("root")
);
