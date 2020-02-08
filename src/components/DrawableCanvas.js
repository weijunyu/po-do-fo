import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import useBoundingBox from "../lib/useBoundingBox";

function DrawableCanvas(props) {
  const [canvasBox, canvasRef] = useBoundingBox(props.dimensions);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectBasePos, setRectBasePos] = useState({});
  const [currentRect, setCurrentRect] = useState({});

  useEffect(() => {
    const canvas = canvasRef.current;
    // Resizing
    canvas.height = props.dimensions.height;
    canvas.width = props.dimensions.width;
  }, [canvasRef, props.dimensions]);

  useEffect(() => {
    if (props.clearCanvas && canvasRef.current) {
      let canvasCtx = canvasRef.current.getContext("2d");

      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      props.onDrawCancelled();
    }
  }, [canvasRef, props]);

  function startDrawing(e) {
    if (!props.drawingEnabled) return;
    setIsDrawing(true);
    setRectBasePos({
      x: e.clientX - canvasBox.left,
      y: e.clientY - canvasBox.top
    });
  }
  function stopDrawing(event) {
    if (!props.drawingEnabled) return;
    setIsDrawing(false);

    let canvasCtx = canvasRef.current.getContext("2d");
    canvasCtx.beginPath();

    saveRect(event);

    props.onDrawComplete();
  }
  function draw(e) {
    if (!props.drawingEnabled) return;
    let canvasCtx = canvasRef.current.getContext("2d");
    if (isDrawing) {
      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      canvasCtx.beginPath();
      let width = e.clientX - canvasBox.left - rectBasePos.x;
      let height = e.clientY - canvasBox.top - rectBasePos.y;
      canvasCtx.rect(rectBasePos.x, rectBasePos.y, width, height);
      canvasCtx.strokeStyle = "black";
      canvasCtx.lineWidth = 10;
      canvasCtx.fill();
    }
  }
  async function saveRect(e) {
    let width = e.clientX - canvasBox.left - rectBasePos.x;
    let height = e.clientY - canvasBox.top - rectBasePos.y;
    setCurrentRect({
      x: rectBasePos.x,
      y: rectBasePos.y,
      width,
      height
    });
  }

  return (
    <canvas
      className="drawable-canvas"
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        cursor: props.drawingEnabled ? "crosshair" : "auto"
      }}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseMove={draw}
    ></canvas>
  );
}

DrawableCanvas.defaultProps = {
  onDrawComplete: () => {},
  onDrawCancelled: () => {}
};

function mapStateToProps(state) {
  return { pages: state.pages };
}

export default connect(mapStateToProps)(DrawableCanvas);
