import React from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "./App.css";

class App extends React.Component {
  state = {
    uppy: null
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
      reader.onload = event => {
        
      }
    });
  }
  render() {
    return (
      <div className="App">
        <div className="uploader"></div>
      </div>
    );
  }
}

export default App;
