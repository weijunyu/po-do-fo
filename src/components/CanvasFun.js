import React, { useEffect, useState } from "react";
import "./CanvasFun.css";
function CanvasFun() {
  const canvasRef = React.createRef();
  const [painting, setPainting] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Resizing
    canvas.height = 768;
    canvas.width = 1024;

    ctx.fillStyle = "red";
    ctx.strokeStyle = "blue";

    ctx.fillRect(25, 50, 10, 20);
    ctx.strokeRect(100, 100, 30, 25);

    ctx.beginPath();
    ctx.moveTo(150, 100);
    ctx.lineTo(175, 105);
    ctx.lineTo(175, 130);
    ctx.closePath();
    ctx.stroke();
  }, [canvasRef]);
  function startPainting() {
    setPainting(true);
  }
  function stopPainting() {
    setPainting(false);
  }
  return (
    <div className="canvas-fun">
      <h1>Canvas below: {painting}</h1>
      <canvas
        id="my-canvas"
        ref={canvasRef}
        onMouseDown={startPainting}
        onMouseUp={stopPainting}
      ></canvas>
    </div>
  );
}

export default CanvasFun;
