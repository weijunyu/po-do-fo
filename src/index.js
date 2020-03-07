import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { pdfjs } from "react-pdf";

import App from "./App";
import store from "./redux/store";

import { DrawableCanvasContextProvider } from "./context/DrawableCanvasContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <DrawableCanvasContextProvider>
        <App />
      </DrawableCanvasContextProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
