import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useRouteMatch, Link } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import Uppy from "@uppy/core";
import DragDrop from "@uppy/drag-drop";

import { loadPagesFromFile } from "../redux/actions";

import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import "./Sidebar.css";

function Sidebar(props) {
  const match = useRouteMatch("/edit");

  return (
    <div className="sidebar">
      {match ? (
        <Link to="/" className="btn primary back">
          Back
        </Link>
      ) : (
        PdfLoader(props)
      )}
    </div>
  );
}

function PdfLoader(props) {
  const { loadPagesFromFile } = props;
  useEffect(() => {
    Uppy({
      onBeforeFileAdded: currentFile => {
        // Use this to load files into state
        // Uppy blocks re-uploads by default
        loadPagesFromFile(currentFile);
      }
    }).use(DragDrop, {
      target: ".loader"
    });
  }, [loadPagesFromFile]);

  async function exportPdf() {
    let newDocument = await PDFDocument.create();
    for (let page of props.pages) {
      let pageDoc = await PDFDocument.load(page.bytes);
      const [pdfPage] = await newDocument.copyPages(pageDoc, [0]);
      newDocument.addPage(pdfPage);
    }
    let final = await newDocument.save();
    const file = new File([final], "export.pdf", { type: "application/pdf" });
    saveAs(file);
  }

  return (
    <>
      <div className="loader"></div>
      {props.pages.length > 0 ? (
        <button className="btn primary compressed" onClick={exportPdf}>
          Export PDF
        </button>
      ) : null}
    </>
  );
}

function mapStateToProps(state) {
  return { pages: state.pages };
}

const mapDispatchToProps = {
  loadPagesFromFile
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
