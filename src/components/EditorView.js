import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { PDFDocument, rgb } from "pdf-lib";
import styled from "styled-components";

import DocumentFrame from "./DocumentFrame";
import DrawableCanvas from "./DrawableCanvas";
import EditorViewControls from "./EditorViewControls";

import DrawableCanvasContext from "../context/DrawableCanvasContext";

import {
  setPage,
  stopDrawing,
  setShowSaveConfirmation,
} from "../redux/actions";

const mapDispatchToProps = {
  setPage,
  stopDrawing,
  setShowSaveConfirmation,
};

function mapStateToProps(state) {
  return {
    showSaveConfirmation: state.editor.showSaveConfirmation,
    drawnRectDimensions: state.editor.drawnRectDimensions,
    canvasMouseupPosition: state.editor.canvasMouseupPosition,
    fillColour: state.editor.fillColour,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorView);

function EditorView(props) {
  const { dimensions, setDimensions, clearCanvas } = useContext(
    DrawableCanvasContext
  );

  function onSaveDrawingClick() {
    props.setShowSaveConfirmation(false);
    saveDrawnRectToPdfPage();
  }

  function onCancelDrawingClick(options = {}) {
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
      height: canvas.offsetHeight,
    });
  }

  async function saveDrawnRectToPdfPage() {
    let pagePdfDoc = await PDFDocument.load(props.page.bytes);
    let pages = pagePdfDoc.getPages();
    let pdfPage = pages[0];
    pdfPage.drawRectangle({
      ...props.drawnRectDimensions,
      color: rgb(
        props.fillColour.r / 255,
        props.fillColour.g / 255,
        props.fillColour.b / 255
      ),
    });
    let pdfBytes = await pagePdfDoc.save();
    props.setPage(props.pageIndex, pdfBytes);
  }

  return (
    <div style={{ position: "relative" }}>
      <EditorViewControls
        onCancelDrawing={() => onCancelDrawingClick({ stopDrawing: true })}
      />

      <div
        className="document-editor-container"
        style={{
          position: "relative",
          width: dimensions.width,
          height: dimensions.height,
          margin: "0 auto",
        }}
      >
        <DocumentFrame
          pageBytes={props.page.bytes}
          onRenderSuccess={getLoadedPageSize}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <DrawableCanvas dimensions={dimensions} />
        {props.showSaveConfirmation ? (
          <DrawingConfirmation
            position={{
              left: props.canvasMouseupPosition.left,
              top: props.canvasMouseupPosition.top,
            }}
            onSaveDrawingClick={onSaveDrawingClick}
            onCancelDrawingClick={onCancelDrawingClick}
          />
        ) : null}
      </div>
    </div>
  );
}

const DrawingConfirmationContainer = styled.div`
  position: absolute;
  z-index: 1;
  transform: translateY(-100%);
  display: flex;
  flex-direction: column;
  left: ${(props) => props.position.left}px;
  top: ${(props) => props.position.top}px;
`;

const DrawingConfirmationButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 0.2rem;
`;

function DrawingConfirmation({
  position,
  onSaveDrawingClick,
  onCancelDrawingClick,
}) {
  useEffect(() => {
    function listenForKeypress(e) {
      if (e.key === "Enter") {
        onSaveDrawingClick();
      }
      if (e.key === "Escape") {
        onCancelDrawingClick();
      }
    }
    document.addEventListener("keydown", listenForKeypress);
    return () => {
      document.removeEventListener("keydown", listenForKeypress);
    };
  }, [onSaveDrawingClick, onCancelDrawingClick]);
  return (
    <DrawingConfirmationContainer position={position}>
      <DrawingConfirmationButton className="" onClick={onSaveDrawingClick}>
        <i className="fas fa-check"></i>
        Enter
      </DrawingConfirmationButton>
      <DrawingConfirmationButton
        className=""
        onClick={() => onCancelDrawingClick()}
      >
        <i className="fas fa-times"></i>
        Esc
      </DrawingConfirmationButton>
    </DrawingConfirmationContainer>
  );
}
