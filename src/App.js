import React from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import { connect } from "react-redux";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

import MainPdfView from "./components/MainPdfView";
import { loadPagesFromFile } from "./redux/actions";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "./App.css";

class App extends React.Component {
  state = {
    uppy: null,
    documents: []
  };
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

  componentDidMount() {
    let uppyInstance = Uppy().use(Dashboard, {
      target: ".uploader",
      inline: true
    });
    this.setState({
      uppy: uppyInstance
    });
    uppyInstance.on("file-added", this.props.loadPagesFromFile);
  }

  renderPageList() {
    if (this.props.pages.length > 0) {
      return this.props.pages.map((page, index) => {
        const blob = new Blob([page], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        return (
          <div style={{ width: "100%", position: "relative" }} key={index}>
            <iframe
              key={index}
              src={blobUrl}
              title={`page-${index}`}
              style={{ width: "100%", height: "100%" }}
            ></iframe>
          </div>
        );
      });
    }
  }
  render() {
    return (
      <div className="App">
        <div className="sidenav">
          <div className="uploader"></div>
          {this.props.pages.length > 0 ? (
            <button className="btn primary" onClick={this.exportPdf}>
              Export PDF
            </button>
          ) : null}
        </div>
        <div className="main">
          <MainPdfView />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
