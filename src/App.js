import React from "react";
import { Switch, Route } from "react-router-dom";
import MainPdfView from "./components/MainPdfView";
import EditorView from "./components/EditorView";
import Sidebar from "./components/Sidebar";

import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="main">
          <Switch>
            <Route path="/edit/:pageIndex">
              <EditorView />
            </Route>
            <Route path="/">
              <MainPdfView />
            </Route>
          </Switch>
        </div>
        <Sidebar />
      </div>
    );
  }
}

export default App;
