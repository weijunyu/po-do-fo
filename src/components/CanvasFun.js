import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "./CanvasFun.css";

function CanvasFun() {
  const [canvasRef] = useState(React.createRef());
  const [painting, setPainting] = useState(false);
  const [canvasCtx, setCanvasCtx] = useState(null);
  const [mouseCoordinates, setMouseCoordinates] = useState([]);
  const [canvasPosition, setCanvasPosition] = useState({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setCanvasCtx(ctx);

    // Resizing
    canvas.height = 600;
    canvas.width = 800;

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
    ctx.beginPath();
  }, [canvasRef]);

  useEffect(() => {
    const rect = canvasRef.current.getBoundingClientRect();
    setCanvasPosition(rect);
    function onScroll() {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasPosition(rect);
    }
    window.addEventListener("scroll", onScroll);
    return function cleanup() {
      window.removeEventListener("scroll", onScroll);
    };
  }, [canvasRef]);

  function startPainting(e) {
    setPainting(true);
    paint(e, true);
  }
  function stopPainting() {
    setPainting(false);
    canvasCtx.beginPath();
  }
  /**
   *
   * @param {*} e
   * @param {*} force Force drawing to happen. E.g. when simply a mouse click
   */
  function paint(e, force = false) {
    setMouseCoordinates([e.clientX, e.clientY]);
    if (!painting && !force) return;
    canvasCtx.lineWidth = 10;
    canvasCtx.lineCap = "round";
    canvasCtx.lineTo(
      e.clientX - canvasPosition.x,
      e.clientY - canvasPosition.y
    ); // Go to mouse
    canvasCtx.stroke();
    canvasCtx.beginPath();
    canvasCtx.moveTo(
      e.clientX - canvasPosition.x,
      e.clientY - canvasPosition.y
    );
  }

  function exportCanvas() {
    const imgData = canvasRef.current.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF();
    pdf.addImage(imgData, "JPEG", 0, 0);
    pdf.save("export.pdf");
  }

  return (
    <div className="canvas-fun">
      <h2>Start painting!</h2>
      <div className="canvas-container">
        <canvas
          id="my-canvas"
          ref={canvasRef}
          onMouseDown={startPainting}
          onMouseUp={stopPainting}
          onMouseMove={paint}
        ></canvas>
      </div>
      <button
        className="btn primary"
        onClick={exportCanvas}
        style={{ display: "block", margin: ".5rem auto" }}
      >
        Save
      </button>
    </div>
  );
}

export default CanvasFun;
