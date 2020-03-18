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
    if (!props.drawingMode) return;
    setIsDrawing(true);
    startDraw(e, { drawingMode: props.drawingMode.mode });
  }
  function onCanvasMouseUp(event) {
    if (!props.drawingMode) return;
    setIsDrawing(false);
    endDraw(event, { drawingMode: props.drawingMode.mode });
    props.setShowSaveConfirmation(true);
  }
  function onCanvasMouseMove(e) {
    if (!props.drawingMode) return;
    if (isDrawing) {
      draw(e, { drawingMode: props.drawingMode.mode });
    }
  }

  function startDraw(event, options) {
    switch (options.drawingMode) {
      case "rectangle": {
        setRectBasePos({
          x: event.clientX - canvasBox.left,
          y: event.clientY - canvasBox.top
        });
        break;
      }
      default:
        break;
    }
  }

  function endDraw(event, options) {
    let canvasCtx = canvasRef.current.getContext("2d");
    canvasCtx.beginPath();

    switch (options.drawingMode) {
      case "rectangle": {
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
        break;
      }
      default:
        break;
    }
  }

  function draw(event, options) {
    let canvasCtx = canvasRef.current.getContext("2d");
    switch (options.drawingMode) {
      case "rectangle": {
        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        canvasCtx.beginPath();
        let width = event.clientX - canvasBox.left - rectBasePos.x;
        let height = event.clientY - canvasBox.top - rectBasePos.y;
        canvasCtx.rect(rectBasePos.x, rectBasePos.y, width, height);
        canvasCtx.strokeStyle = "black";
        canvasCtx.fill();
        break;
      }
      default:
        break;
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
        cursor: props.drawingMode ? "crosshair" : "auto"
      }}
      onMouseDown={onCanvasMouseDown}
      onMouseUp={onCanvasMouseUp}
      onMouseMove={onCanvasMouseMove}
      height={props.dimensions.height}
      width={props.dimensions.width}
    ></canvas>
  );
}

DrawableCanvas.propTypes = {
  drawingMode: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      mode: PropTypes.string
    })
  ]), // "rectangle", "pen" buttons set drawingMode.
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
    drawingMode: state.editor.drawing // Whenever button clicked, enter drawing state
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawableCanvas);
