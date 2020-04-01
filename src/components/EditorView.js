import React, { useContext } from "react";
import { connect } from "react-redux";
import { PDFDocument, rgb } from "pdf-lib";

import DocumentFrame from "./DocumentFrame";
import DrawableCanvas from "./DrawableCanvas";
import EditorViewControls from "./EditorViewControls";

import DrawableCanvasContext from "../context/DrawableCanvasContext";

import {
  setPage,
  stopDrawing,
  setShowSaveConfirmation
} from "../redux/actions";

import editorViewStyles from "./EditorView.module.css";

const mapDispatchToProps = {
  setPage,
  stopDrawing,
  setShowSaveConfirmation
};

function mapStateToProps(state) {
  return {
    showSaveConfirmation: state.editor.showSaveConfirmation,
    drawnRectDimensions: state.editor.drawnRectDimensions,
    canvasMouseupPosition: state.editor.canvasMouseupPosition,
    fillColour: state.editor.fillColour
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorView);

function EditorView(props) {
  const { dimensions, setDimensions, clearCanvas } = useContext(
    DrawableCanvasContext
  );

  function onSaveDrawingClick() {
    props.setShowSaveConfirmation(false);
    saveDrawnRectToPdf();
  }

  function onCancelDrawingClick(options) {
    if (options.stopDrawing) {
      props.stopDrawing();
    }
    props.setShowSaveConfirmation(false);
    clearCanvas();
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
    pdfPage.drawRectangle({
      ...props.drawnRectDimensions,
      color: rgb(
        props.fillColour.r / 255,
        props.fillColour.g / 255,
        props.fillColour.b / 255
      )
    });
    let pdfBytes = await pagePdfDoc.save();
    props.setPage(props.pageIndex, pdfBytes);
  }

  return (
    <div className={editorViewStyles["editor-view"] + " container"}>
      <EditorViewControls
        onCancelDrawing={() => onCancelDrawingClick({ stopDrawing: true })}
      />

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
            <button className="button is-small" onClick={onSaveDrawingClick}>
              <i className="fas fa-check"></i>
            </button>
            <button className="button is-small" onClick={onCancelDrawingClick}>
              <i className="fas fa-times"></i>
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
