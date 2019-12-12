import React from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import { PDFDocument } from "pdf-lib";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "./App.css";

class App extends React.Component {
  state = {
    uppy: null,
    documents: [],
    pages: []
  };
  componentDidMount() {
    let uppyInstance = Uppy().use(Dashboard, {
      target: ".uploader",
      inline: true
    });
    this.setState({
      uppy: uppyInstance
    });
    uppyInstance.on("file-added", file => {
      let fileRef = file.data;
      let reader = new FileReader();
      reader.onload = async () => {
        const pdfDoc = await PDFDocument.load(reader.result);

        let newDocs = [];
        for (let i = 0; i < pdfDoc.getPageCount(); i++) {
          let newDoc = await PDFDocument.create();
          let [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
          newDoc.addPage(copiedPage);
          let newDocBytes = await newDoc.save();
          newDocs.push(newDocBytes);
        }
        this.setState({
          documents: [...this.state.documents, ...newDocs]
        });
      };
      reader.readAsArrayBuffer(fileRef);
    });
  }
  renderDocuments() {
    if (this.state.documents.length > 0) {
      return this.state.documents.map((document, index) => {
        const blob = new Blob([document], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        return (
          <div className="document" key={index}>
            <iframe
              src={blobUrl}
              title={index}
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
        <div className="uploader"></div>
        {this.renderDocuments()}
      </div>
    );
  }
}

export default App;
