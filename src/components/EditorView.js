import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router-dom";

import DocumentFrame from "./DocumentFrame";
import DrawableCanvas from "./DrawableCanvas";

import "./EditorView.css";

function EditorView(props) {
  const routeParams = useParams();
  const pageIndex = parseInt(routeParams.pageIndex);
  const [loadedPageDimensions, setLoadedPageDimensions] = useState({
    width: 0,
    height: 0
  });
  const [drawing, setDrawing] = useState(false);
  const [showDrawConfirmation, setShowDrawConfirmation] = useState(false);

  if (props.pages.length === 0) {
    return <Redirect to="/" />;
  }

  function getLoadedPageSize() {
    let canvas = document.querySelector(`canvas.react-pdf__Page__canvas`);
    setLoadedPageDimensions({
      width: canvas.offsetWidth,
      height: canvas.offsetHeight
    });
  }

  function onDrawComplete() {
    setDrawing(false);
    setShowDrawConfirmation(true);
  }

  function saveCanvasToPdf() {
    setShowDrawConfirmation(false);
  }

  function cancelCanvasEdit() {
    setShowDrawConfirmation(false);
  }

  return (
    <div className="editor-view">
      <div
        className="document-editor-container"
        style={{
          position: "relative",
          width: loadedPageDimensions.width,
          height: loadedPageDimensions.height
        }}
      >
        <DocumentFrame
          pageBytes={props.pages[pageIndex].bytes}
          className={`page-${pageIndex}`}
          editable={true}
          onRenderSuccess={getLoadedPageSize}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <DrawableCanvas
          dimensions={loadedPageDimensions}
          drawingEnabled={drawing}
          onDrawComplete={onDrawComplete}
        />
      </div>
      <div className="editor-controls">
        {showDrawConfirmation ? (
          <>
            <button className="btn" onClick={saveCanvasToPdf}>
              Save
            </button>
            <button className="btn" onClick={cancelCanvasEdit}>
              Cancel
            </button>
          </>
        ) : null}
        <button className="btn" onClick={() => setDrawing(true)}>
          Rectangle
        </button>
        <button className="btn success">Save</button>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { pages: state.pages };
}

export default connect(mapStateToProps)(EditorView);
