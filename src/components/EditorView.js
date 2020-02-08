import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router-dom";

import DocumentFrame from "./DocumentFrame";

import "./EditorView.css";

function EditorView(props) {
  const routeParams = useParams();
  const pageIndex = parseInt(routeParams.pageIndex);
  const [loadedPageDimensions, setLoadedPageDimensions] = useState({
    width: 0,
    height: 0
  });
  const [drawing, setDrawing] = useState(false);

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
        <DrawableCanvas
          drawingEnabled={drawing}
          dimensions={loadedPageDimensions}
        />
      </div>
      <div className="editor-controls">
        <button className="btn" onClick={() => setDrawing(true)}>
          Rectangle
        </button>
        <button className="btn success">Save</button>
      </div>
    </div>
  );
}

function DrawableCanvas(props) {
  const [canvasBox, canvasRef] = useBoundingBox(props.dimensions);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectBasePos, setRectBasePos] = useState({});
  const [currentRect, setCurrentRect] = useState({});

  useEffect(() => {
    const canvas = canvasRef.current;
    // Resizing
    canvas.height = props.dimensions.height;
    canvas.width = props.dimensions.width;
  }, [canvasRef, props.dimensions]);

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
    saveRect(event);
    let canvasCtx = canvasRef.current.getContext("2d");
    canvasCtx.beginPath();
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
      canvasCtx.lineWidth = 10;
      canvasCtx.fill();
    }
  }
  function saveRect(e) {
    let width = e.clientX - canvasBox.left - rectBasePos.x;
    let height = e.clientY - canvasBox.top - rectBasePos.y;
    setCurrentRect({
      x: rectBasePos.x,
      y: rectBasePos.y,
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
    ></canvas>
  );
}

export const useBoundingBox = dimensions => {
  const ref = useRef();
  const [bbox, setBbox] = useState({});

  const set = () =>
    setBbox(ref && ref.current ? ref.current.getBoundingClientRect() : {});

  useEffect(() => {
    set();
    window.addEventListener("scroll", set);
    return () => window.removeEventListener("scroll", set);
  }, [dimensions]);

  return [bbox, ref];
};

function mapStateToProps(state) {
  return { pages: state.pages };
}

export default connect(mapStateToProps)(EditorView);
