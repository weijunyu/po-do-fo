import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./redux/store";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./normalize.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
