import React from "react";

import MainPdfView from "./components/MainPdfView";
import Sidebar from "./components/Sidebar";

import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Sidebar />
        <div className="main">
          <MainPdfView />
        </div>
      </div>
    );
  }
}

export default App;
