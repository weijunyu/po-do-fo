import React from "react";
import { connect } from "react-redux";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import Uppy from "@uppy/core";
import DragDrop from "@uppy/drag-drop";

import { loadPagesFromFile } from "../redux/actions";

import "./Sidebar.css";

class Sidebar extends React.Component {
  componentDidMount() {
    let uppyInstance = Uppy().use(DragDrop, {
      target: ".loader"
    });
    uppyInstance.on("file-added", this.props.loadPagesFromFile);
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
