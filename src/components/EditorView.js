import React from "react";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router-dom";

import DocumentFrame from "./DocumentFrame";

import "./EditorView.css";

function EditorView(props) {
  const routeParams = useParams();
  const pageIndex = parseInt(routeParams.pageIndex);

  if (props.pages.length === 0) {
    return <Redirect to="/" />;
  }

  return (
    <div className="editor-view">
      <DocumentFrame
        pageBytes={props.pages[pageIndex].bytes}
        className={`page-${pageIndex}`}
        editable={true}
      />
      <div className="editor-controls">
        <button className="btn success">Save</button>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { pages: state.pages };
}
export default connect(mapStateToProps)(EditorView);
