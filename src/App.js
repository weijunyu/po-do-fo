import React from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import { connect } from "react-redux";
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
        <div className="uploader"></div>
        <div style={{ display: "flex" }}>
          <div className="page-list">{this.renderPageList()}</div>
          <div className="main">
            <MainPdfView />
          </div>
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
