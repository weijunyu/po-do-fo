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
import "./Sidebar.scss";

function Sidebar(props) {
  const match = useRouteMatch("/edit");

  return (
    <div className="sidebar">
      {match ? (
        <Link to="/" className="button is-primary">
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
      target: ".pdf-loader"
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

  async function exportPdfInImages() {
    // new pdf doc
    let newDoc = await PDFDocument.create();
    let canvases = document.querySelectorAll("canvas.react-pdf__Page__canvas");
    // for every canvas element,
    // get image, make new page, copy image to new page
    for (let canvas of canvases) {
      let b64CanvasImage = canvas.toDataURL();
      let pdfImg = await newDoc.embedPng(b64CanvasImage);
      let newPage = newDoc.addPage([pdfImg.width, pdfImg.height]);
      newPage.drawImage(pdfImg, {
        x: 0,
        y: 0,
        width: pdfImg.width,
        height: pdfImg.height
      });
    }
    // let user download pdf doc
    let final = await newDoc.save();
    const file = new File([final], "export.pdf", { type: "application/pdf" });
    saveAs(file);
  }

  return (
    <>
      <div className="pdf-loader"></div>
      {props.pages.length > 0 ? (
        <>
          <button className="button is-primary compressed" onClick={exportPdf}>
            Export PDF
          </button>
          <button className="button is-primary compressed" onClick={exportPdfInImages}>
            Export PDF (Image Mode)
          </button>
        </>
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
