import React, { useState } from "react";
import useBoundingBox from "../lib/useBoundingBox";

const context = React.createContext();

export function DrawableCanvasContextProvider({ children }) {
  let [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  let [bbox, ref] = useBoundingBox(dimensions);
  function clearCanvas() {
    if (ref.current) {
      let canvasCtx = ref.current.getContext("2d");
      canvasCtx.clearRect(0, 0, ref.current.width, ref.current.height);
    }
  }
  let value = {
    bbox,
    ref,
    dimensions,
    setDimensions,
    clearCanvas
  };
  return <context.Provider value={value}>{children}</context.Provider>;
}

export default context;
