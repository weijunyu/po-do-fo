import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router-dom";

import DocumentFrame from "./DocumentFrame";

import "./EditorView.css";

function EditorView(props) {
  const canvasRef = React.createRef();
  const routeParams = useParams();
  const pageIndex = parseInt(routeParams.pageIndex);
  const [loadedPageDimensions, setLoadedPageDimensions] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Resizing
    canvas.height = 600;
    canvas.width = 800;

    ctx.fillStyle = "red";
    ctx.strokeStyle = "blue";

    ctx.fillRect(25, 50, 10, 20);
    ctx.strokeRect(100, 100, 30, 25);

    ctx.beginPath();
    ctx.moveTo(150, 100);
    ctx.lineTo(175, 105);
    ctx.lineTo(175, 130);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
  }, [canvasRef]);

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
        <canvas
          className="drawable-canvas"
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
        ></canvas>
      </div>
      <div className="editor-controls">
        <button className="btn success">Save</button>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { pages: state.pages };
}
export default connect(mapStateToProps)(EditorView);
