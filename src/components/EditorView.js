import React, { useContext } from "react";
import { connect } from "react-redux";
import { PDFDocument } from "pdf-lib";

import DocumentFrame from "./DocumentFrame";
import DrawableCanvas from "./DrawableCanvas";

import DrawableCanvasContext from "../context/DrawableCanvasContext";

import {
  setPage,
  startDrawing,
  stopDrawing,
  setShowSaveConfirmation
} from "../redux/actions";

import editorViewStyles from "./EditorView.module.css";

function EditorView(props) {
  const { dimensions, setDimensions, clearCanvas } = useContext(
    DrawableCanvasContext
  );

  function onSaveDrawingClick() {
    props.stopDrawing();
    props.setShowSaveConfirmation(false);
    saveDrawnRectToPdf();
  }

  function onCancelDrawingClick() {
    props.stopDrawing();
    props.setShowSaveConfirmation(false);
    clearCanvas();
  }

  function onDrawRectangleClick() {
    if (!props.drawing) {
      props.startDrawing({
        mode: "rectangle"
      });
    } else {
      onCancelDrawingClick();
    }
  }

  function onDrawPenClick() {
    if (!props.drawing) {
      props.startDrawing({
        mode: "pen"
      });
    } else {
      onCancelDrawingClick();
    }
  }

  function getLoadedPageSize() {
    let canvas = document.querySelector(`canvas.react-pdf__Page__canvas`);
    setDimensions({
      width: canvas.offsetWidth,
      height: canvas.offsetHeight
    });
  }

  async function saveDrawnRectToPdf() {
    props.setShowSaveConfirmation(false);
    let pagePdfDoc = await PDFDocument.load(props.page.bytes);
    let pages = pagePdfDoc.getPages();
    let pdfPage = pages[0];
    pdfPage.drawRectangle(props.drawnRectDimensions);
    let pdfBytes = await pagePdfDoc.save();
    props.setPage(props.pageIndex, pdfBytes);
  }

  return (
    <div className={editorViewStyles["editor-view"] + " container"}>
      <div className={editorViewStyles["editor-controls"]}>
        <button
          className={`button is-small ${
            props.drawing && props.drawing.mode === "rectangle"
              ? "is-primary"
              : ""
          }`}
          onClick={onDrawRectangleClick}
        >
          Rectangle (fill)
        </button>
        <button
          className={`button is-small ${
            props.drawing && props.drawing.mode === "pen" ? "is-primary" : ""
          }`}
          onClick={onDrawPenClick}
        >
          Pen
        </button>
      </div>

      <div
        className="document-editor-container"
        style={{
          position: "relative",
          width: dimensions.width,
          height: dimensions.height,
          margin: "0 auto"
        }}
      >
        {props.showSaveConfirmation ? (
          <div
            className={editorViewStyles["save-drawing-confirmation"]}
            style={{
              left: props.canvasMouseupPosition.left,
              top: props.canvasMouseupPosition.top
            }}
          >
            <button
              className="button is-primary is-small"
              onClick={onSaveDrawingClick}
            >
              Save
            </button>
            <button className="button is-small" onClick={onCancelDrawingClick}>
              Cancel
            </button>
          </div>
        ) : null}
        <DocumentFrame
          pageBytes={props.page.bytes}
          className={`page-${props.pageIndex}`}
          onRenderSuccess={getLoadedPageSize}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <DrawableCanvas dimensions={dimensions} />
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setPage,
  startDrawing,
  stopDrawing,
  setShowSaveConfirmation
};

function mapStateToProps(state) {
  return {
    drawing: state.editor.drawing,
    showSaveConfirmation: state.editor.showSaveConfirmation,
    drawnRectDimensions: state.editor.drawnRectDimensions,
    canvasMouseupPosition: state.editor.canvasMouseupPosition
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorView);
