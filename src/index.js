import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./redux/store";
import { observe } from "./Game";

observe(knightPosition =>
  ReactDOM.render(
    <Provider store={store}>
      <App knightPosition={knightPosition}/>
    </Provider>,
    document.getElementById("root")
  )
);
