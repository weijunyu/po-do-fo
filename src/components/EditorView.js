import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import { PDFDocument } from "pdf-lib";

import { setPage } from "../redux/actions";
import DocumentFrame from "./DocumentFrame";

import "./EditorView.css";

function EditorView(props) {
  let documentFrameRef = React.createRef();
  const [showTextBox, setShowTextBox] = useState(false);
  const [cursorLocation, setCursorLocation] = useState({});
  const [textBoxLocation, setTextBoxLocation] = useState({});
  const [isPlacingTextBox, setIsPlacingTextBox] = useState(false);
  const routeParams = useParams();
  const pageIndex = parseInt(routeParams.pageIndex);

  useEffect(() => {
    function recordMousePosition(e) {
      setCursorLocation({ x: e.clientX, y: e.clientY });
    }
    document.addEventListener("mousemove", recordMousePosition);
    return function() {
      document.removeEventListener("mousemove", recordMousePosition);
    };
  }, []);

  if (props.pages.length === 0) {
    return <Redirect to="/" />;
  }

  async function saveCanvasAsPdf() {
    let canvas = document.querySelector(`.page-${pageIndex} canvas`);
    let newDoc = await PDFDocument.create();
    let imgData = canvas.toDataURL("image/jpeg", 1.0);
    let pdfImage = await newDoc.embedJpg(imgData);
    const page = newDoc.addPage();
    page.drawImage(pdfImage);
    const pdfBytes = await newDoc.save();
    props.setPage(pageIndex, pdfBytes);
  }

  function onViewClick(e) {
    if (isPlacingTextBox) {
      let editorViewEl = document.querySelector(`.editor-view`);
      // if e.target is within canvas, set absolute x and y position values for text box.
      const rect = editorViewEl.getBoundingClientRect();
      setTextBoxLocation({
        x: e.clientX - rect.x,
        y: e.clientY - rect.y
      });
      setShowTextBox(true);
      setIsPlacingTextBox(false);
    } else if (showTextBox) {
      if (e.target === document.querySelector(".text-input-overlay")) return;
      setShowTextBox(false);
    }
  }

  return (
    <div className="editor-view" onClick={onViewClick}>
      <DocumentFrame
        pageBytes={props.pages[pageIndex].bytes}
        className={`page-${pageIndex}`}
        editable={true}
        ref={documentFrameRef}
        style={{ cursor: isPlacingTextBox ? "crosshair" : "auto" }}
      />
      {showTextBox ? (
        <TextInput
          close={() => setShowTextBox(false)}
          location={textBoxLocation}
        />
      ) : null}
      <div className="editor-controls">
        <button className="btn" onClick={() => setIsPlacingTextBox(true)}>
          Add Text
        </button>
        <button className="btn success" onClick={saveCanvasAsPdf}>
          Save
        </button>
      </div>
    </div>
  );
}

function TextInput({ close, location }) {
  useEffect(() => {
    document.querySelector(".text-input-overlay").focus();
  }, []);
  return (
    <div style={{ position: "absolute", left: location.x, top: location.y }}>
      <input className="text-input-overlay" type="text" />
      <button onClick={close}>OK</button>
    </div>
  );
}

function mapStateToProps(state) {
  return { pages: state.pages };
}
const mapDispatchToProps = {
  setPage
};
export default connect(mapStateToProps, mapDispatchToProps)(EditorView);
