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
        <button className="btn success">Save</button>
      </div>
    </div>
  );
}

function DrawableCanvas(props) {
  const [canvasBox, canvasRef] = useBoundingBox(props.dimensions);
  const [isDrawing, setIsDrawing] = useState(false);

  function startDrawing(e) {
    setIsDrawing(true);
  }
  function stopDrawing() {
    setIsDrawing(false);
    let canvasCtx = canvasRef.current.getContext("2d");
    canvasCtx.beginPath();
  }
  function draw(e) {
    let canvasCtx = canvasRef.current.getContext("2d");
    if (isDrawing) {
      canvasCtx.lineWidth = 10;
      canvasCtx.lineCap = "round";
      canvasCtx.lineTo(e.clientX - canvasBox.left, e.clientY - canvasBox.top); // Go to mouse
      canvasCtx.stroke();
      canvasCtx.beginPath();
      canvasCtx.moveTo(e.clientX - canvasBox.left, e.clientY - canvasBox.top);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    // Resizing
    canvas.height = props.dimensions.height;
    canvas.width = props.dimensions.width;

    // const ctx = canvas.getContext("2d");
    // ctx.fillStyle = "red";
    // ctx.strokeStyle = "blue";

    // ctx.fillRect(25, 50, 10, 20);
    // ctx.strokeRect(100, 100, 30, 25);

    // ctx.beginPath();
    // ctx.moveTo(10, 10);
    // for (let y = 10; y < 100; y += 10) {
    //   ctx.lineTo(y + 80, y);
    // }
    // ctx.fill();
  }, [canvasRef, props.dimensions]);

  return (
    <canvas
      className="drawable-canvas"
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0
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
