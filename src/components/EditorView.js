import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router-dom";

import DocumentFrame from "./DocumentFrame";
import DrawableCanvas from "./DrawableCanvas";

import {
  startDrawing,
  setShowSaveConfirmation,
  cancelDraw
} from "../redux/actions";

import "./EditorView.css";

function EditorView(props) {
  const routeParams = useParams();
  const pageIndex = parseInt(routeParams.pageIndex);
  const [loadedPageDimensions, setLoadedPageDimensions] = useState({
    width: 0,
    height: 0
  });

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
        <DrawableCanvas dimensions={loadedPageDimensions} />
      </div>
      <div className="editor-controls">
        {props.showSaveConfirmation ? (
          <>
            <button
              className="btn"
              onClick={() => props.setShowSaveConfirmation(false)}
            >
              Save
            </button>
            <button
              className="btn"
              onClick={() => {
                props.cancelDraw();
                props.setShowSaveConfirmation(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : null}
        <button className="btn" onClick={props.startDrawing}>
          Rectangle
        </button>
        <button className="btn success">Save</button>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  startDrawing,
  setShowSaveConfirmation,
  cancelDraw
};

function mapStateToProps(state) {
  return {
    pages: state.pages,
    showSaveConfirmation: state.editor.showSaveConfirmation
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorView);
