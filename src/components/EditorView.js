import React from "react";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import { PDFDocument } from "pdf-lib";

import { setPage } from "../redux/actions";
import DocumentFrame from "./DocumentFrame";

import "./EditorView.css";

function EditorView(props) {
  const routeParams = useParams();
  const pageIndex = parseInt(routeParams.pageIndex);

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
  return (
    <div className="editor-view">
      <DocumentFrame
        pageBytes={props.pages[pageIndex].bytes}
        className={`page-${pageIndex}`}
        editable={true}
      />
      <div className="editor-controls">
        <button className="btn success" onClick={saveCanvasAsPdf}>
          Save
        </button>
      </div>
    </div>
  );
}
function mapStateToProps(state) {
  return { pages: state.pages };
}
const mapDispatchToProps = {
  setPage
};
export default connect(mapStateToProps,mapDispatchToProps)(EditorView);
