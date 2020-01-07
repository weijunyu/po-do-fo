import React from "react";
import { connect } from "react-redux";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import Uppy from "@uppy/core";
import DragDrop from "@uppy/drag-drop";

import { loadPagesFromFile } from "../redux/actions";

import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import "./Sidebar.css";

class Sidebar extends React.Component {
  componentDidMount() {
    Uppy({
      onBeforeFileAdded: currentFile => {
        // Use this to load files into state
        // Uppy blocks re-uploads by default
        this.props.loadPagesFromFile(currentFile);
      }
    }).use(DragDrop, {
      target: ".loader"
    });
  }

  exportPdf = async () => {
    let newDocument = await PDFDocument.create();
    for (let pageBytes of this.props.pages) {
      let pageDoc = await PDFDocument.load(pageBytes);
      const [pdfPage] = await newDocument.copyPages(pageDoc, [0]);
      newDocument.addPage(pdfPage);
    }
    let final = await newDocument.save();
    const file = new File([final], "export.pdf", { type: "application/pdf" });
    saveAs(file);
  };
  render() {
    return (
      <div className="sidenav">
        <div className="loader"></div>
        {this.props.pages.length > 0 ? (
          <button className="btn primary" onClick={this.exportPdf}>
            Export PDF
          </button>
        ) : null}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { pages: state.pages };
}

const mapDispatchToProps = {
  loadPagesFromFile
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
