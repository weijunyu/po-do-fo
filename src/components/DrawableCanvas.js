import React, { useState, useContext } from "react";
import { connect } from "react-redux";

import {
  stopDrawing,
  setShowSaveConfirmation,
  saveDrawRectDimensions
} from "../redux/actions";

import DrawableCanvasContext from "../context/DrawableCanvasContext";

function DrawableCanvas(props) {
  const drawableCanvasContext = useContext(DrawableCanvasContext);
  const canvasBox = drawableCanvasContext.bbox;
  const canvasRef = drawableCanvasContext.ref;
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectBasePos, setRectBasePos] = useState({});

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
    props.stopDrawing();
    props.setShowSaveConfirmation(true);
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
      canvasCtx.fill();
    }
  }
  async function saveRect(e) {
    let width = e.clientX - canvasBox.left - rectBasePos.x;
    let height = e.clientY - canvasBox.top - rectBasePos.y;
    // Transform Y axis direction
    height = height * -1;
    let transformedBaseY = canvasBox.bottom - canvasBox.top - rectBasePos.y;
    props.saveDrawRectDimensions({
      x: rectBasePos.x,
      y: transformedBaseY,
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
      height={props.dimensions.height}
      width={props.dimensions.width}
    ></canvas>
  );
}

const mapDispatchToProps = {
  stopDrawing,
  setShowSaveConfirmation,
  saveDrawRectDimensions
};

function mapStateToProps(state) {
  return {
    pages: state.pages,
    drawingEnabled: state.editor.drawing
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawableCanvas);
