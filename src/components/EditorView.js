import React, { useContext } from "react";
import { connect } from "react-redux";
import { PDFDocument } from "pdf-lib";

import DocumentFrame from "./DocumentFrame";
import DrawableCanvas from "./DrawableCanvas";

import DrawableCanvasContext from "../context/DrawableCanvasContext";

import {
  setPage,
  startDrawing,
  setShowSaveConfirmation
} from "../redux/actions";

import "./EditorView.css";

function EditorView(props) {
  const { dimensions, setDimensions, clearCanvas } = useContext(
    DrawableCanvasContext
  );

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
    <div className="editor-view">
      <div
        className="document-editor-container"
        style={{
          position: "relative",
          width: dimensions.width,
          height: dimensions.height
        }}
      >
        <DocumentFrame
          pageBytes={props.page.bytes}
          className={`page-${props.pageIndex}`}
          onRenderSuccess={getLoadedPageSize}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <DrawableCanvas dimensions={dimensions} />
      </div>
      <div className="editor-controls">
        {props.showSaveConfirmation ? (
          <>
            <button className="btn" onClick={saveDrawnRectToPdf}>
              Save
            </button>
            <button
              className="btn"
              onClick={() => {
                props.setShowSaveConfirmation(false);
                clearCanvas();
              }}
            >
              Cancel
            </button>
          </>
        ) : null}
        <button className="btn" onClick={props.startDrawing}>
          Rectangle (fill)
        </button>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setPage,
  startDrawing,
  setShowSaveConfirmation
};

function mapStateToProps(state) {
  return {
    showSaveConfirmation: state.editor.showSaveConfirmation,
    drawnRectDimensions: state.editor.drawnRectDimensions
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorView);
