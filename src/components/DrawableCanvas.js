import React, { useState, useContext } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  saveCanvasDrawingDetails,
  setShowSaveConfirmation
} from "../redux/actions";

import DrawableCanvasContext from "../context/DrawableCanvasContext";

function DrawableCanvas(props) {
  const drawableCanvasContext = useContext(DrawableCanvasContext);
  const canvasBox = drawableCanvasContext.bbox;
  const canvasRef = drawableCanvasContext.ref;
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectBasePos, setRectBasePos] = useState({});

  function onCanvasMouseDown(e) {
    if (!props.drawingEnabled) return;
    setIsDrawing(true);
    setRectBasePos({
      x: e.clientX - canvasBox.left,
      y: e.clientY - canvasBox.top
    });
  }
  function onCanvasMouseUp(event) {
    if (!props.drawingEnabled) return;
    setIsDrawing(false);

    let canvasCtx = canvasRef.current.getContext("2d");
    canvasCtx.beginPath();

    // Save rect properties in state; used for drawing on PDF
    let width = event.clientX - canvasBox.left - rectBasePos.x;
    let height = event.clientY - canvasBox.top - rectBasePos.y;
    // Transform Y axis direction
    height = height * -1;
    let transformedBaseY = canvasBox.bottom - canvasBox.top - rectBasePos.y;

    props.saveCanvasDrawingDetails({
      canvasMouseupPosition: {
        left: event.clientX - canvasBox.left,
        top: event.clientY - canvasBox.top
      },
      drawnRectDimensions: {
        x: rectBasePos.x,
        y: transformedBaseY,
        width,
        height
      }
    });
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
      onMouseDown={onCanvasMouseDown}
      onMouseUp={onCanvasMouseUp}
      onMouseMove={draw}
      height={props.dimensions.height}
      width={props.dimensions.width}
    ></canvas>
  );
}

DrawableCanvas.propTypes = {
  drawingEnabled: PropTypes.bool.isRequired, // E.g. external button to enable drawing
  saveCanvasDrawingDetails: PropTypes.func.isRequired, // Signal that draw is done

  dimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number
  })
};

const mapDispatchToProps = {
  saveCanvasDrawingDetails,
  setShowSaveConfirmation
};

function mapStateToProps(state) {
  return {
    drawingEnabled: state.editor.drawing // Whenever button clicked, enter drawing state
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawableCanvas);
