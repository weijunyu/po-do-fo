import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useRouteMatch, Link } from "react-router-dom";
import Uppy from "@uppy/core";
import DragDrop from "@uppy/drag-drop";

import { loadPagesFromFile } from "../redux/actions";
import { exportPdf, exportPdfInImages } from "../lib";

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
      onBeforeFileAdded: (currentFile) => {
        // Use this to load files into state
        // Uppy blocks re-uploads by default
        loadPagesFromFile(currentFile);
      },
    }).use(DragDrop, {
      target: ".pdf-loader",
    });
  }, [loadPagesFromFile]);

  return (
    <>
      <div className="pdf-loader"></div>
      {props.pages.length > 0 ? (
        <>
          <button
            className="button is-primary compressed"
            onClick={() => exportPdf(props.pages)}
          >
            Export PDF
          </button>
          <button
            className="button is-primary compressed"
            onClick={exportPdfInImages}
          >
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
  loadPagesFromFile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
