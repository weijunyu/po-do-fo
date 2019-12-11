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
    documents: []
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
        this.setState({
          documents: [...this.state.documents, pdfDoc]
        });
      };
      reader.readAsArrayBuffer(fileRef);
    });
  }
  render() {
    return (
      <div className="App">
        <div className="uploader"></div>
        <p>{this.state.documents.length}</p>
      </div>
    );
  }
}

export default App;
