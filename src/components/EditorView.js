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

  function selectAddTextLocation() {
    document.body.style.cursor = "crosshair";

    document.addEventListener("click", function changeCursor(e) {
      document.body.style.cursor = "auto";
      document.removeEventListener("click", changeCursor);

      setShowTextBox(true);
      let editorViewEl = document.querySelector(`.editor-view`);
      // if e.target is within canvas, set absolute x and y position values for text box.
      const rect = editorViewEl.getBoundingClientRect();
      console.log(rect.x, rect.y);
      console.log(cursorLocation.x, cursorLocation.y); // TODO: fix this closure!
      setTextBoxLocation({
        x: cursorLocation.x - rect.x,
        y: cursorLocation.y - rect.y
      });
    });
  }

  return (
    <div className="editor-view">
      <DocumentFrame
        pageBytes={props.pages[pageIndex].bytes}
        className={`page-${pageIndex}`}
        editable={true}
        ref={documentFrameRef}
      />
      {showTextBox ? (
        <TextInput
          close={() => setShowTextBox(false)}
          location={textBoxLocation}
        />
      ) : null}
      <div className="editor-controls">
        <button className="btn" onClick={selectAddTextLocation}>
          Add Text
        </button>
        <button className="btn success" onClick={saveCanvasAsPdf}>
          Save
        </button>
        <p>
          {cursorLocation.x}, {cursorLocation.y}
        </p>
      </div>
    </div>
  );
}

function TextInput({ close, location }) {
  return (
    <div style={{ position: "absolute", left: location.x, top: location.y }}>
      <input type="text" />
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
