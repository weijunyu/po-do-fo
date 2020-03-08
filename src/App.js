import React from "react";
import { Switch, Route } from "react-router-dom";
import MainPdfView from "./components/MainPdfView";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";

import "./App.scss";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="main">
          <Switch>
            <Route path="/edit/:pageIndex">
              <Editor />
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
